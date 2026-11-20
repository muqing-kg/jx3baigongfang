/**
 * 剑网三物价助手 · 物价历史 JSON 存储
 *
 * 目录结构：
 *   data/price-history/index.json          日期索引（区服、日期、快照点数）
 *   data/price-history/days/YYYY-MM-DD.json 每日明细
 *
 * 每日文件以“第一个价格变化点”的完整快照为 base，后续每次价格变化只追加
 * 相对上一点的增量，避免每 30 分钟重复保存 17 服 × 267 物品的全量数据。
 *
 *   base.prices[serverId][itemId] = 金价
 *   samples[].prices[serverId][itemId] = 新金价；null 表示本服该物品不再有报价
 *   base.stones[serverId][level] = 金价
 *   coverage[serverId] = [有效报价数, 过滤数, 无报价数]
 *
 * 未发生价格变化的行情检查不写文件，因此不会产生空提交；查询时“某个时间点”
 * 的完整价格 = 该时间点之前最后一个快照点。
 */
import fs from 'node:fs';
import path from 'node:path';

export const PRICE_HISTORY_SCHEMA = 1;
export const PRICE_HISTORY_TIMEZONE = 'Asia/Shanghai';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function clone(value) {
  if (value === null || value === undefined) return value;
  return JSON.parse(JSON.stringify(value));
}

function maxStamp(a, b) {
  if (!a) return b || '';
  if (!b) return a;
  return a >= b ? a : b;
}

export function shanghaiTimestamp(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: PRICE_HISTORY_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
  });
  const parts = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') parts[part.type] = part.value;
  }
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+08:00`;
}

export function historyDateOf(at) {
  const match = String(at || '').match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match || !DATE_RE.test(match[1])) throw new Error(`无效的北京时间：${at}`);
  return match[1];
}

export function priceHistoryDir(root) {
  return path.join(root, 'data', 'price-history');
}

export function priceHistoryDaysDir(root) {
  return path.join(priceHistoryDir(root), 'days');
}

export function priceHistoryIndexPath(root) {
  return path.join(priceHistoryDir(root), 'index.json');
}

export function priceHistoryDayPath(root, date) {
  if (!DATE_RE.test(String(date))) throw new Error(`无效日期：${date}`);
  return path.join(priceHistoryDaysDir(root), `${date}.json`);
}

function atomicWriteFile(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  try {
    fs.writeFileSync(tmp, text, 'utf8');
    fs.renameSync(tmp, file);
  } finally {
    try {
      if (fs.existsSync(tmp)) fs.rmSync(tmp, { force: true });
    } catch {
      /* ignore cleanup failure */
    }
  }
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    if (err && err.code === 'ENOENT') return fallback;
    throw new Error(`无法读取物价历史 ${file}：${err.message}`);
  }
}

function emptyIndex() {
  return {
    schemaVersion: PRICE_HISTORY_SCHEMA,
    timezone: PRICE_HISTORY_TIMEZONE,
    updatedAt: '',
    catalogVersion: '',
    itemCount: 0,
    servers: [],
    days: [],
  };
}

function normalizeCoverage(serverCoverage, serverIds) {
  const ids = serverIds && serverIds.length ? serverIds : Object.keys(serverCoverage || {});
  const coverage = {};
  for (const id of ids) {
    const item = serverCoverage && serverCoverage[id];
    if (!item) continue;
    coverage[id] = [
      Number(item.updated) || 0,
      Number(item.filtered) || 0,
      Number(item.noQuote) || 0,
    ];
  }
  return coverage;
}

function isPrice(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function diffMap(previous, next) {
  const prev = previous && typeof previous === 'object' ? previous : {};
  const current = next && typeof next === 'object' ? next : {};
  const out = {};
  const serverIds = new Set([...Object.keys(prev), ...Object.keys(current)]);
  for (const serverId of serverIds) {
    const before = prev[serverId] && typeof prev[serverId] === 'object' ? prev[serverId] : {};
    const after = current[serverId] && typeof current[serverId] === 'object' ? current[serverId] : {};
    const changes = {};
    for (const [key, value] of Object.entries(after)) {
      if (isPrice(value) && before[key] !== value) changes[key] = value;
    }
    for (const key of Object.keys(before)) {
      if (!isPrice(after[key])) changes[key] = null;
    }
    if (Object.keys(changes).length) out[serverId] = changes;
  }
  return out;
}

function applyDelta(target, delta) {
  if (!delta || typeof delta !== 'object') return;
  for (const [serverId, changes] of Object.entries(delta)) {
    if (!changes || typeof changes !== 'object') continue;
    if (!target[serverId]) target[serverId] = {};
    const bucket = target[serverId];
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) delete bucket[key];
      else if (isPrice(value)) bucket[key] = value;
    }
    if (!Object.keys(bucket).length) delete target[serverId];
  }
}

function countDelta(delta) {
  let count = 0;
  for (const changes of Object.values(delta || {})) count += Object.keys(changes).length;
  return count;
}

function diffFlatMap(previous, next) {
  const prev = previous && typeof previous === 'object' ? previous : {};
  const current = next && typeof next === 'object' ? next : {};
  const out = {};
  for (const [key, value] of Object.entries(current)) {
    if (isPrice(value) && prev[key] !== value) out[key] = value;
  }
  for (const key of Object.keys(prev)) {
    if (!isPrice(current[key])) out[key] = null;
  }
  return out;
}

function applyFlatDelta(target, delta) {
  if (!delta || typeof delta !== 'object') return;
  for (const [key, value] of Object.entries(delta)) {
    if (value === null) delete target[key];
    else if (isPrice(value)) target[key] = value;
  }
}

function lastStateOfDay(day) {
  const state = {
    prices: clone(day.base.prices || {}),
    stones: clone(day.base.stones || {}),
    catalogPrices: clone(day.base.catalogPrices || {}),
    stoneCatalogPrices: clone(day.base.stoneCatalogPrices || {}),
  };
  for (const sample of day.samples || []) {
    applyDelta(state.prices, sample.prices);
    applyDelta(state.stones, sample.stones);
    applyFlatDelta(state.catalogPrices, sample.catalogPrices);
    applyFlatDelta(state.stoneCatalogPrices, sample.stoneCatalogPrices);
  }
  return state;
}

function serializeDay(day) {
  const base = day.base || {};
  const lines = ['{'];
  lines.push(`  "schemaVersion": ${JSON.stringify(day.schemaVersion || PRICE_HISTORY_SCHEMA)},`);
  lines.push(`  "date": ${JSON.stringify(day.date)},`);
  lines.push(`  "timezone": ${JSON.stringify(day.timezone || PRICE_HISTORY_TIMEZONE)},`);
  lines.push(`  "catalogVersion": ${JSON.stringify(day.catalogVersion || '')},`);
  lines.push(`  "itemCount": ${Number(day.itemCount) || 0},`);
  lines.push(`  "createdAt": ${JSON.stringify(day.createdAt || base.at || '')},`);
  lines.push(`  "updatedAt": ${JSON.stringify(day.updatedAt || base.at || '')},`);
  if (day.compacted) lines.push('  "compacted": true,');
  lines.push('  "base": {');
  lines.push(`    "at": ${JSON.stringify(base.at)},`);
  lines.push(`    "requested": ${JSON.stringify(base.requested || [])},`);
  if (base.source) lines.push(`    "source": ${JSON.stringify(base.source)},`);
  lines.push(`    "coverage": ${JSON.stringify(base.coverage || {})},`);
  lines.push(`    "catalogPrices": ${JSON.stringify(base.catalogPrices || {})},`);
  lines.push(`    "stoneCatalogPrices": ${JSON.stringify(base.stoneCatalogPrices || {})},`);
  lines.push('    "prices": {');
  const priceEntries = Object.entries(base.prices || {});
  priceEntries.forEach(([serverId, bucket], index) => {
    lines.push(`      ${JSON.stringify(serverId)}: ${JSON.stringify(bucket || {})}${index < priceEntries.length - 1 ? ',' : ''}`);
  });
  lines.push('    },');
  lines.push('    "stones": {');
  const stoneEntries = Object.entries(base.stones || {});
  stoneEntries.forEach(([serverId, bucket], index) => {
    lines.push(`      ${JSON.stringify(serverId)}: ${JSON.stringify(bucket || {})}${index < stoneEntries.length - 1 ? ',' : ''}`);
  });
  lines.push('    }');
  lines.push('  },');
  lines.push('  "samples": [');
  (day.samples || []).forEach((sample, index) => {
    lines.push(`    ${JSON.stringify(sample)}${index < day.samples.length - 1 ? ',' : ''}`);
  });
  lines.push('  ]');
  lines.push('}');
  return lines.join('\n') + '\n';
}

function indexEntry(day, file) {
  const last = day.samples && day.samples.length ? day.samples[day.samples.length - 1] : day.base;
  let bytes = 0;
  try {
    bytes = fs.statSync(file).size;
  } catch {
    /* index can still be built if the file disappeared */
  }
  return {
    date: day.date,
    file: `days/${day.date}.json`,
    points: 1 + (day.samples ? day.samples.length : 0),
    baseAt: day.base && day.base.at ? day.base.at : '',
    lastAt: last && last.at ? last.at : '',
    catalogVersion: day.catalogVersion || '',
    itemCount: Number(day.itemCount) || 0,
    compacted: !!day.compacted,
    bytes,
  };
}

export function loadPriceHistoryDay(root, date) {
  const file = priceHistoryDayPath(root, date);
  const day = readJson(file, null);
  if (!day) return null;
  if (day.schemaVersion > PRICE_HISTORY_SCHEMA) {
    throw new Error(`${file} 的 schemaVersion 高于当前脚本支持的版本`);
  }
  if (!day.base || !day.base.at) throw new Error(`${file} 缺少 base.at`);
  if (!Array.isArray(day.samples)) day.samples = [];
  return day;
}

export function readPriceHistoryIndex(root) {
  const index = readJson(priceHistoryIndexPath(root), null);
  if (!index) return null;
  if (index.schemaVersion > PRICE_HISTORY_SCHEMA) {
    throw new Error(`${priceHistoryIndexPath(root)} 的 schemaVersion 高于当前脚本支持的版本`);
  }
  if (!Array.isArray(index.days)) index.days = [];
  return index;
}

function scanDayFiles(root) {
  const dir = priceHistoryDaysDir(root);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => DATE_RE.test(name.replace(/\.json$/, '')) && name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, ''))
    .sort();
}

function scanDayEntries(root) {
  const entries = [];
  for (const date of scanDayFiles(root)) {
    const day = loadPriceHistoryDay(root, date);
    if (!day) continue;
    entries.push(indexEntry(day, priceHistoryDayPath(root, date)));
  }
  return entries;
}

export function listPriceHistoryDays(root) {
  const index = readPriceHistoryIndex(root);
  const known = new Map(((index && index.days) || []).map((entry) => [entry.date, entry]));
  const entries = [];
  for (const date of scanDayFiles(root)) {
    if (known.has(date)) {
      entries.push(known.get(date));
      continue;
    }
    const day = loadPriceHistoryDay(root, date);
    if (day) entries.push(indexEntry(day, priceHistoryDayPath(root, date)));
  }
  return entries.sort((a, b) => String(a.date).localeCompare(String(b.date)));
}

export function updatePriceHistoryIndex(root, day, data = null) {
  const file = priceHistoryDayPath(root, day.date);
  const index = readPriceHistoryIndex(root) || emptyIndex();
  const servers = data && Array.isArray(data.servers) && data.servers.length
    ? data.servers.map((server) => ({ id: server.id, name: server.name, region: server.region || '' }))
    : index.servers;
  const entry = indexEntry(day, file);
  const days = listPriceHistoryDays(root).filter((item) => item.date !== day.date);
  days.push(entry);
  days.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const next = {
    schemaVersion: PRICE_HISTORY_SCHEMA,
    timezone: PRICE_HISTORY_TIMEZONE,
    updatedAt: maxStamp(index.updatedAt, day.updatedAt || day.base.at),
    catalogVersion: (data && data.meta && data.meta.catalogVersion) || day.catalogVersion || index.catalogVersion || '',
    itemCount: (data && Array.isArray(data.items) && data.items.length) || Number(day.itemCount) || index.itemCount || 0,
    servers,
    days,
  };
  atomicWriteFile(priceHistoryIndexPath(root), JSON.stringify(next, null, 2) + '\n');
  return next;
}

export function rebuildPriceHistoryIndex(root, data = null) {
  const index = readPriceHistoryIndex(root) || emptyIndex();
  const entries = scanDayEntries(root);
  const latest = entries.length ? entries[entries.length - 1] : null;
  const servers = data && Array.isArray(data.servers) && data.servers.length
    ? data.servers.map((server) => ({ id: server.id, name: server.name, region: server.region || '' }))
    : index.servers;
  const next = {
    schemaVersion: PRICE_HISTORY_SCHEMA,
    timezone: PRICE_HISTORY_TIMEZONE,
    updatedAt: entries.reduce((value, entry) => maxStamp(value, entry.lastAt), index.updatedAt || ''),
    catalogVersion: (data && data.meta && data.meta.catalogVersion) || (latest && latest.catalogVersion) || index.catalogVersion || '',
    itemCount: (data && Array.isArray(data.items) && data.items.length) || (latest && latest.itemCount) || index.itemCount || 0,
    servers,
    days: entries,
  };
  atomicWriteFile(priceHistoryIndexPath(root), JSON.stringify(next, null, 2) + '\n');
  return next;
}

export function recordPriceSnapshot({
  root,
  data,
  at = shanghaiTimestamp(),
  requestedServerIds,
  serverCoverage,
  source = 'update',
  force = false,
} = {}) {
  if (!root) throw new Error('缺少项目根目录 root');
  if (!data || typeof data !== 'object' || !data.serverPrices) throw new Error('缺少 data.serverPrices');
  const timestamp = String(at);
  const date = historyDateOf(timestamp);
  const ids = Array.isArray(requestedServerIds) && requestedServerIds.length
    ? requestedServerIds
    : (data.servers || []).map((server) => server.id).filter(Boolean);
  const coverage = normalizeCoverage(serverCoverage || (data.meta && data.meta.serverCoverage) || {}, ids);
  const prices = clone(data.serverPrices || {});
  const stones = clone(data.stonePrices || {});
  const catalogPrices = {};
  for (const item of data.items || []) {
    if (item && item.id && isPrice(item.base)) catalogPrices[item.id] = item.base;
  }
  const stoneCatalogPrices = {};
  for (const stone of data.stones || []) {
    if (stone && stone.level !== undefined && isPrice(stone.base)) stoneCatalogPrices[String(stone.level)] = stone.base;
  }
  const file = priceHistoryDayPath(root, date);
  let day = loadPriceHistoryDay(root, date);

  if (!day) {
    if (!force) return { created: false, appended: false, file, skipped: 'no-day' };
    day = {
      schemaVersion: PRICE_HISTORY_SCHEMA,
      date,
      timezone: PRICE_HISTORY_TIMEZONE,
      catalogVersion: (data.meta && data.meta.catalogVersion) || '',
      itemCount: (data.items || []).length,
      createdAt: timestamp,
      updatedAt: timestamp,
      base: {
        at: timestamp,
        requested: ids,
        source,
        coverage,
        prices,
        stones,
        catalogPrices,
        stoneCatalogPrices,
      },
      samples: [],
    };
    atomicWriteFile(file, serializeDay(day));
    const index = updatePriceHistoryIndex(root, day, data);
    return { created: true, appended: false, file, day, index, changed: 0 };
  }

  const sameAt = day.samples.length && day.samples[day.samples.length - 1].at === timestamp;
  const comparable = sameAt
    ? Object.assign({}, day, { samples: day.samples.slice(0, -1) })
    : day;
  const last = lastStateOfDay(comparable);
  const pricesDelta = diffMap(last.prices, prices);
  const stonesDelta = diffMap(last.stones, stones);
  const catalogDelta = diffFlatMap(last.catalogPrices, catalogPrices);
  const stoneCatalogDelta = diffFlatMap(last.stoneCatalogPrices, stoneCatalogPrices);
  const changed = countDelta(pricesDelta) + countDelta(stonesDelta)
    + Object.keys(catalogDelta).length + Object.keys(stoneCatalogDelta).length;
  if (!changed) {
    return { created: false, appended: false, file, day, changed: 0 };
  }

  const sample = {
    at: timestamp,
    requested: ids,
    coverage,
    source,
  };
  if (Object.keys(pricesDelta).length) sample.prices = pricesDelta;
  if (Object.keys(stonesDelta).length) sample.stones = stonesDelta;
  if (Object.keys(catalogDelta).length) sample.catalogPrices = catalogDelta;
  if (Object.keys(stoneCatalogDelta).length) sample.stoneCatalogPrices = stoneCatalogDelta;
  const catalogVersion = (data.meta && data.meta.catalogVersion) || '';
  if (catalogVersion && catalogVersion !== day.catalogVersion) sample.catalogVersion = catalogVersion;

  day.samples = comparable.samples.concat(sample);
  day.updatedAt = maxStamp(day.updatedAt, timestamp);
  if (catalogVersion) day.catalogVersion = catalogVersion;
  if (Array.isArray(data.items) && data.items.length) day.itemCount = data.items.length;
  atomicWriteFile(file, serializeDay(day));
  const index = updatePriceHistoryIndex(root, day, data);
  return { created: false, appended: true, file, day, index, changed };
}

export function seedPriceHistory(root, data, at = null) {
  if (!data || !data.serverPrices) throw new Error('缺少 data.serverPrices');
  const timestamp = at || (data.meta && data.meta.priceUpdatedAt) || shanghaiTimestamp();
  const date = historyDateOf(timestamp);
  if (loadPriceHistoryDay(root, date)) {
    return { created: false, appended: false, skipped: 'day-exists', file: priceHistoryDayPath(root, date) };
  }
  return recordPriceSnapshot({
    root,
    data,
    at: timestamp,
    force: true,
    source: 'seed',
  });
}

/**
 * 遍历某天的所有快照点。state 会在回调之间原地更新，回调里请立即读取，
 * 不要保存 state 引用。回调返回 false 可提前结束。
 */
export function forEachDayPoint(day, callback) {
  const state = {
    prices: clone(day.base.prices || {}),
    stones: clone(day.base.stones || {}),
    catalogPrices: clone(day.base.catalogPrices || {}),
    stoneCatalogPrices: clone(day.base.stoneCatalogPrices || {}),
  };
  if (callback({
    at: day.base.at,
    requested: day.base.requested || [],
    coverage: day.base.coverage || {},
    source: day.base.source || '',
    state,
  }) === false) return false;
  for (const sample of day.samples || []) {
    applyDelta(state.prices, sample.prices);
    applyDelta(state.stones, sample.stones);
    applyFlatDelta(state.catalogPrices, sample.catalogPrices);
    applyFlatDelta(state.stoneCatalogPrices, sample.stoneCatalogPrices);
    if (callback({
      at: sample.at,
      requested: sample.requested || [],
      coverage: sample.coverage || {},
      source: sample.source || '',
      state,
    }) === false) return false;
  }
  return true;
}

export function eachHistoryPoint(root, callback) {
  const days = listPriceHistoryDays(root);
  for (const entry of days) {
    const day = loadPriceHistoryDay(root, entry.date);
    if (!day) continue;
    if (forEachDayPoint(day, callback) === false) return false;
  }
  return true;
}

export function replayPriceHistoryDayTo(day, targetMs) {
  const baseMs = Date.parse(day.base.at);
  if (!Number.isFinite(baseMs) || baseMs > targetMs) return null;
  const state = {
    prices: clone(day.base.prices || {}),
    stones: clone(day.base.stones || {}),
    catalogPrices: clone(day.base.catalogPrices || {}),
    stoneCatalogPrices: clone(day.base.stoneCatalogPrices || {}),
  };
  let point = {
    at: day.base.at,
    requested: day.base.requested || [],
    coverage: day.base.coverage || {},
    source: day.base.source || '',
  };
  for (const sample of day.samples || []) {
    const atMs = Date.parse(sample.at);
    if (!Number.isFinite(atMs) || atMs > targetMs) break;
    applyDelta(state.prices, sample.prices);
    applyDelta(state.stones, sample.stones);
    applyFlatDelta(state.catalogPrices, sample.catalogPrices);
    applyFlatDelta(state.stoneCatalogPrices, sample.stoneCatalogPrices);
    point = {
      at: sample.at,
      requested: sample.requested || [],
      coverage: sample.coverage || {},
      source: sample.source || '',
    };
  }
  return Object.assign({}, point, { state: clone(state) });
}

export function priceHistoryStateAt(root, at) {
  const target = at instanceof Date ? at.getTime() : Date.parse(String(at));
  if (!Number.isFinite(target)) throw new Error(`无效时间：${at}`);
  const days = listPriceHistoryDays(root).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  for (const entry of days) {
    const day = loadPriceHistoryDay(root, entry.date);
    if (!day) continue;
    const baseMs = Date.parse(day.base.at);
    // 折叠后的旧日期只剩当天最后一个快照。目标时间早于它时，日内更早的价格
    // 已被有意丢弃，不能悄悄回退到更早一天的旧值。
    if (day.compacted && Number.isFinite(baseMs) && baseMs > target) return null;
    const point = replayPriceHistoryDayTo(day, target);
    if (point) return Object.assign({ date: day.date }, point);
  }
  return null;
}

export function compactPriceHistoryDay(root, date, data = null) {
  const day = loadPriceHistoryDay(root, date);
  if (!day || !day.samples || !day.samples.length) return false;
  const last = replayPriceHistoryDayTo(day, Number.POSITIVE_INFINITY);
  if (!last) return false;
  day.base = {
    at: last.at,
    requested: last.requested,
    source: last.source,
    coverage: last.coverage,
    prices: last.state.prices,
    stones: last.state.stones,
    catalogPrices: last.state.catalogPrices,
    stoneCatalogPrices: last.state.stoneCatalogPrices,
  };
  day.samples = [];
  day.compacted = true;
  day.updatedAt = last.at;
  atomicWriteFile(priceHistoryDayPath(root, date), serializeDay(day));
  updatePriceHistoryIndex(root, day, data);
  return true;
}

export function compactPriceHistoryBefore(root, beforeDate, data = null) {
  if (!DATE_RE.test(String(beforeDate))) throw new Error(`无效日期：${beforeDate}`);
  const days = listPriceHistoryDays(root);
  let compacted = 0;
  for (const entry of days) {
    if (entry.date >= beforeDate) continue;
    const day = loadPriceHistoryDay(root, entry.date);
    if (!day || !day.samples || !day.samples.length) continue;
    if (compactPriceHistoryDay(root, entry.date, data)) compacted += 1;
  }
  return compacted;
}

export function extractEffectiveValues(state, { serverIds = null, itemIds = null } = {}) {
  const values = new Map();
  const serverAllowed = serverIds ? new Set(serverIds) : null;
  const itemAllowed = itemIds ? new Set(itemIds) : null;
  const allServers = new Set([
    ...Object.keys(state.prices || {}),
    ...Object.keys(state.stones || {}),
    ...(serverIds || []),
  ]);
  for (const serverId of allServers) {
    if (serverAllowed && !serverAllowed.has(serverId)) continue;
    const quotes = state.prices[serverId] || {};
    const catalog = state.catalogPrices || {};
    for (const itemId of new Set([...Object.keys(quotes), ...Object.keys(catalog)])) {
      if (itemAllowed && !itemAllowed.has(itemId)) continue;
      const quoted = isPrice(quotes[itemId]);
      const value = quoted ? quotes[itemId] : catalog[itemId];
      if (!isPrice(value)) continue;
      values.set(`${serverId}\u0000item\u0000${itemId}`, {
        serverId,
        kind: 'item',
        id: itemId,
        price: value,
        source: quoted ? '本服报价' : '基准价',
      });
    }
    const stones = state.stones[serverId] || {};
    const stoneCatalog = state.stoneCatalogPrices || {};
    for (const level of new Set([...Object.keys(stones), ...Object.keys(stoneCatalog)])) {
      const id = `stone:${level}`;
      if (itemAllowed && !itemAllowed.has(id)) continue;
      const quoted = isPrice(stones[level]);
      const value = quoted ? stones[level] : stoneCatalog[level];
      if (!isPrice(value)) continue;
      values.set(`${serverId}\u0000stone\u0000${level}`, {
        serverId,
        kind: 'stone',
        id,
        level,
        price: value,
        source: quoted ? '本服报价' : '基准价',
      });
    }
  }
  return values;
}

export function extractSelectedValues(state, { serverIds = null, itemIds = null } = {}) {
  const values = new Map();
  const serverAllowed = serverIds ? new Set(serverIds) : null;
  const itemAllowed = itemIds ? new Set(itemIds) : null;
  for (const [serverId, bucket] of Object.entries(state.prices || {})) {
    if (serverAllowed && !serverAllowed.has(serverId)) continue;
    for (const [itemId, value] of Object.entries(bucket || {})) {
      if (itemAllowed && !itemAllowed.has(itemId)) continue;
      if (!isPrice(value)) continue;
      values.set(`${serverId}\u0000item\u0000${itemId}`, { serverId, kind: 'item', id: itemId, price: value, source: '本服报价' });
    }
  }
  for (const [serverId, bucket] of Object.entries(state.stones || {})) {
    if (serverAllowed && !serverAllowed.has(serverId)) continue;
    for (const [level, value] of Object.entries(bucket || {})) {
      const id = `stone:${level}`;
      if (itemAllowed && !itemAllowed.has(id)) continue;
      if (!isPrice(value)) continue;
      values.set(`${serverId}\u0000stone\u0000${level}`, { serverId, kind: 'stone', id, level, price: value, source: '本服报价' });
    }
  }
  return values;
}
