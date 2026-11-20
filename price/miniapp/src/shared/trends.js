/* 物价走势小程序适配：优先读微信云数据库历史，失败回退打包快照。 */
import Taro from '@tarojs/taro';
import catalog from './catalog.json';
import BUNDLED from './trends.json';
import { CLOUD_ENV, isCloudConfigured } from './cloudConfig';

const CACHE_KEY = 'jx3-trends-cloud-v1';
const CACHE_TTL = 60 * 60 * 1000;
let active = BUNDLED;
let activeKind = 'bundled';
let cloudInited = false;

const skillMap = {};
const skillOrder = {};
(catalog.skills || []).forEach(function (s, i) {
  skillMap[s.id] = s;
  skillOrder[s.id] = i;
});
const tierMap = {};
(catalog.tiers || []).forEach(function (t) { tierMap[t.id] = t; });

/* 材料可能被多个技艺使用；走势筛选按「使用它的技艺」归类。 */
const usageSkills = {};
(catalog.recipes || []).forEach(function (recipe) {
  (recipe.materials || []).forEach(function (mat) {
    if (!mat || !mat.item) return;
    const list = usageSkills[mat.item] || (usageSkills[mat.item] = []);
    if (recipe.skillId && list.indexOf(recipe.skillId) === -1) list.push(recipe.skillId);
  });
});

const items = [];
(catalog.items || []).forEach(function (item) {
  if (!item || !item.id) return;
  const used = (usageSkills[item.id] || []).slice();
  if (item.skillId && used.indexOf(item.skillId) === -1) used.unshift(item.skillId);
  const skillIds = used.length ? used : (item.skillId ? [item.skillId] : []);
  items.push({
    key: 'item:' + item.id,
    id: item.id,
    name: item.name || item.id,
    kind: item.kind === 'product' ? 'product' : 'material',
    skillId: item.skillId || '',
    skillIds: skillIds,
    skillName: skillIds.length ? skillName(skillIds[0]) : (skillName(item.skillId) || '其他'),
    skillNames: skillIds.map(skillName).join(' / '),
    color: skillColor(item.skillId),
    skillOrder: skillOrder[item.skillId] == null ? 99 : skillOrder[item.skillId],
    tier: Number(item.tier) || 0,
    tierName: (tierMap[item.tier] || {}).name || '其他',
    tierColor: (tierMap[item.tier] || {}).color || '#64748B'
  });
});
(catalog.stones || []).forEach(function (stone) {
  if (!stone || stone.level === undefined) return;
  items.push({
    key: 'stone:' + stone.level,
    id: 'stone:' + stone.level,
    level: String(stone.level),
    name: stone.name || ('五行石（' + stone.level + '级）'),
    kind: 'stone',
    skillId: 'stone',
    skillIds: ['stone'],
    skillName: '五行石',
    skillNames: '五行石',
    color: '#C084FC',
    skillOrder: 100,
    tier: 0,
    tierName: '五行石',
    tierColor: '#C084FC'
  });
});

const itemMap = {};
items.forEach(function (item) { itemMap[item.key] = item; });

function skillName(id) {
  return skillMap[id] ? skillMap[id].name : (id || '其他');
}
function skillColor(id) {
  return skillMap[id] && skillMap[id].color ? skillMap[id].color : '#64748B';
}
function isPrice(v) {
  return typeof v === 'number' && Number.isFinite(v) && v > 0;
}
function clone(value) {
  return value == null ? value : JSON.parse(JSON.stringify(value));
}
function applyDelta(target, delta) {
  if (!delta) return 0;
  let count = 0;
  Object.keys(delta).forEach(function (key) {
    if (delta[key] === null) {
      delete target[key];
      count++;
    } else if (isPrice(delta[key])) {
      target[key] = delta[key];
      count++;
    }
  });
  return count;
}
function effective(catalogPrices, quotes) {
  const out = {};
  Object.keys(catalogPrices || {}).forEach(function (id) {
    if (isPrice(catalogPrices[id])) out[id] = catalogPrices[id];
  });
  Object.keys(quotes || {}).forEach(function (id) {
    if (isPrice(quotes[id])) out[id] = quotes[id];
  });
  return out;
}
function makePoint(at, date, kind, quotes, stones, catalogPrices, stoneCatalogPrices, coverage, changed, source, day) {
  const prices = effective(catalogPrices, quotes);
  const stonePrices = effective(stoneCatalogPrices, stones);
  return {
    at: at,
    date: date,
    kind: kind,
    source: source || 'seed',
    quotes: clone(quotes),
    stones: clone(stones),
    catalog: clone(catalogPrices),
    stoneCatalog: clone(stoneCatalogPrices),
    prices: prices,
    stonePrices: stonePrices,
    coverage: coverage || null,
    changed: changed || 0,
    quoteCount: Object.keys(quotes || {}).length,
    stoneCount: Object.keys(stones || {}).length,
    pricedCount: Object.keys(prices || {}).length,
    itemCount: Number(day && day.itemCount) || (catalog.items || []).length
  };
}

/** 把某服的历史日文件还原成时间节点。 */
export function buildPoints(serverId, data) {
  const points = [];
  ((data || active).days || []).forEach(function (day) {
    if (!day || !day.base) return;
    const base = day.base;
    const quotes = clone((base.prices && base.prices[serverId]) || {});
    const stones = clone((base.stones && base.stones[serverId]) || {});
    const catalogPrices = clone(base.catalogPrices || {});
    const stoneCatalogPrices = clone(base.stoneCatalogPrices || {});
    let coverage = (base.coverage && base.coverage[serverId]) || null;
    let source = base.source || 'seed';
    points.push(makePoint(base.at, day.date, 'base', quotes, stones, catalogPrices, stoneCatalogPrices, coverage, 0, source, day));

    (day.samples || []).forEach(function (sample) {
      let changed = 0;
      changed += applyDelta(quotes, sample.prices && sample.prices[serverId]);
      changed += applyDelta(stones, sample.stones && sample.stones[serverId]);
      changed += applyDelta(catalogPrices, sample.catalogPrices);
      changed += applyDelta(stoneCatalogPrices, sample.stoneCatalogPrices);
      if (sample.coverage && sample.coverage[serverId]) coverage = sample.coverage[serverId];
      source = sample.source || 'update';
      points.push(makePoint(sample.at, day.date, 'update', quotes, stones, catalogPrices, stoneCatalogPrices, coverage, changed, source, day));
    });
  });
  points.sort(function (a, b) { return Date.parse(a.at) - Date.parse(b.at); });
  return points;
}

export function filterPoints(points, range) {
  if (!points || !points.length) return [];
  if (range !== '24h') return points;
  const last = Date.parse(points[points.length - 1].at);
  if (!Number.isFinite(last)) return points;
  const from = last - 24 * 3600000;
  const list = points.filter(function (p) {
    const ms = Date.parse(p.at);
    return Number.isFinite(ms) && ms >= from;
  });
  return list.length ? list : points;
}

export function trendItems(opts) {
  opts = opts || {};
  let list = items.slice();
  if (opts.type === 'material' || opts.type === 'product' || opts.type === 'stone') {
    list = list.filter(function (i) { return i.kind === opts.type; });
  }
  if (opts.skillId === 'stone') {
    list = list.filter(function (i) { return i.kind === 'stone'; });
  } else if (opts.skillId) {
    list = list.filter(function (i) {
      return i.kind !== 'stone' && (i.skillIds || [i.skillId]).indexOf(opts.skillId) !== -1;
    });
  }
  list.sort(function (a, b) {
    if (a.skillOrder !== b.skillOrder) return a.skillOrder - b.skillOrder;
    if (a.kind !== b.kind) return a.kind === 'product' ? -1 : 1;
    if (a.tier !== b.tier) return b.tier - a.tier;
    return String(a.name).localeCompare(String(b.name), 'zh-CN');
  });
  return list;
}

export function trendItem(key) {
  return itemMap[key] || null;
}

export function priceOfPoint(point, item) {
  if (!point || !item) return null;
  if (item.kind === 'stone') {
    const v = point.stonePrices && point.stonePrices[item.level];
    return isPrice(v) ? v : null;
  }
  const v = point.prices && point.prices[item.id];
  return isPrice(v) ? v : null;
}

export function seriesOf(points, item) {
  if (!item) return [];
  const out = [];
  (points || []).forEach(function (point) {
    const price = priceOfPoint(point, item);
    if (price == null) return;
    let quote = null;
    if (item.kind === 'stone') quote = point.stones && point.stones[item.level];
    else quote = point.quotes && point.quotes[item.id];
    out.push({
      at: point.at,
      date: point.date,
      price: price,
      quote: isPrice(quote) ? quote : null,
      source: isPrice(quote) ? '本服报价' : '基准价'
    });
  });
  return out;
}

export function summarize(series) {
  if (!series || !series.length) {
    return { count: 0, first: null, last: null, changePct: null, min: null, max: null, source: '—' };
  }
  const first = series[0].price;
  const last = series[series.length - 1].price;
  let min = last;
  let max = last;
  series.forEach(function (p) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  });
  return {
    count: series.length,
    first: first,
    last: last,
    changePct: first > 0 ? (last / first - 1) * 100 : null,
    min: min,
    max: max,
    source: series[series.length - 1].source,
    firstAt: series[0].at,
    lastAt: series[series.length - 1].at
  };
}

/** 区间涨跌榜；至少两个有效节点才参与。 */
export function rankItems(points, list, limit) {
  const rows = [];
  (list || []).forEach(function (item) {
    const series = seriesOf(points, item);
    if (series.length < 2) return;
    const summary = summarize(series);
    if (summary.changePct == null || !Number.isFinite(summary.changePct)) return;
    rows.push({ item: item, summary: summary });
  });
  rows.sort(function (a, b) {
    const d = Math.abs(b.summary.changePct) - Math.abs(a.summary.changePct);
    if (d) return d;
    return String(a.item.name).localeCompare(String(b.item.name), 'zh-CN');
  });
  return rows.slice(0, limit || 12);
}

export function trendAtText(at) {
  const text = String(at || '');
  return text.length >= 16 ? text.slice(5, 16).replace('T', ' ') : text;
}

export function trendDateText(at) {
  return String(at || '').slice(0, 10);
}

function metaOf(data, kind) {
  const days = (data && data.days) || [];
  return {
    updatedAt: (data && data.updatedAt) || '',
    generatedAt: (data && data.generatedAt) || '',
    catalogVersion: (data && data.catalogVersion) || '',
    days: days.length,
    points: days.reduce(function (n, d) { return n + 1 + ((d.samples || []).length); }, 0),
    serverIds: ((data && data.servers) || []).map(function (s) { return s.id; }),
    kind: kind || 'bundled',
    sourceLabel: kind === 'cloud' ? '云端历史' : '离线快照'
  };
}

export const TREND_META = metaOf(BUNDLED, 'bundled');

export function getTrendData() {
  return active;
}

export function getTrendMeta() {
  return metaOf(active, activeKind);
}

export function applyTrendData(data, kind) {
  if (!data || !Array.isArray(data.days) || !data.days.length) return false;
  const days = data.days.filter(function (day) { return day && day.base; }).slice().sort(function (a, b) {
    return String(a.date || '').localeCompare(String(b.date || ''));
  });
  if (!days.length) return false;
  active = {
    schema: 1,
    updatedAt: data.updatedAt || '',
    generatedAt: data.generatedAt || '',
    catalogVersion: data.catalogVersion || '',
    servers: data.servers || [],
    days: days
  };
  activeKind = kind === 'cloud' ? 'cloud' : 'bundled';
  Object.assign(TREND_META, metaOf(active, activeKind));
  return true;
}

function initCloud() {
  if (cloudInited) return;
  if (!Taro.cloud || typeof Taro.cloud.init !== 'function') throw new Error('当前环境不支持云开发');
  Taro.cloud.init({ env: CLOUD_ENV, traceUser: false });
  cloudInited = true;
}

function readCache() {
  try {
    const raw = Taro.getStorageSync(CACHE_KEY);
    const cache = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!cache || !cache.data || !Array.isArray(cache.data.days) || !cache.data.days.length) return null;
    return cache;
  } catch (e) {
    return null;
  }
}

function writeCache(data) {
  try {
    Taro.setStorageSync(CACHE_KEY, { fetchedAt: Date.now(), data: data });
  } catch (e) { /* 缓存失败不影响页面 */ }
}

async function fetchCloudData() {
  initCloud();
  const db = Taro.cloud.database();
  const metaRes = await db.collection('prices').doc('history_meta').get();
  const meta = metaRes && metaRes.data;
  if (!meta || Number(meta.schema) !== 1 || !Array.isArray(meta.days) || !meta.days.length) {
    throw new Error('云端趋势索引不存在');
  }
  const picked = meta.days.slice(-7);
  const docs = await Promise.all(picked.map(function (entry) {
    return db.collection('prices').doc('history_' + entry.date).get()
      .then(function (res) { return res.data; })
      .catch(function () { return null; });
  }));
  const days = docs.filter(function (day) { return day && day.base; });
  if (!days.length) throw new Error('云端趋势节点为空');
  const data = {
    schema: 1,
    updatedAt: meta.updatedAt || '',
    generatedAt: meta.generatedAt || '',
    catalogVersion: meta.catalogVersion || '',
    servers: meta.servers || [],
    days: days
  };
  applyTrendData(data, 'cloud');
  writeCache(data);
  return { ok: true, source: 'cloud', meta: getTrendMeta(), data: data };
}

/**
 * 载入趋势：云历史 > 本地缓存 > 打包快照。
 * force=true 时跳过 1 小时 TTL，供页面刷新按钮使用。
 */
export async function loadTrendData(force) {
  if (!isCloudConfigured()) {
    return { ok: true, source: 'bundled', meta: getTrendMeta(), data: active };
  }
  const cache = readCache();
  if (!force && cache && Date.now() - Number(cache.fetchedAt || 0) < CACHE_TTL) {
    applyTrendData(cache.data, 'cloud');
    return { ok: true, source: 'cache', meta: getTrendMeta(), data: active };
  }
  try {
    return await fetchCloudData();
  } catch (e) {
    if (cache) {
      applyTrendData(cache.data, 'cloud');
      return { ok: false, source: 'cache', meta: getTrendMeta(), data: active, error: e.message };
    }
    return { ok: false, source: 'bundled', meta: getTrendMeta(), data: active, error: e.message };
  }
}

export { items as TREND_ITEMS };
