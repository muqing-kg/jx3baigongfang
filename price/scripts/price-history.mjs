#!/usr/bin/env node
/**
 * 剑网三物价助手 · 物价历史查询 / 导出
 *
 * 常用：
 *   node scripts/price-history.mjs list
 *   node scripts/price-history.mjs as-of 2026-11-20T10:30 --server 梦江南
 *   node scripts/price-history.mjs series --server 梦江南 --item 玄元星平衫 --from 2026-11-20
 *   node scripts/price-history.mjs export --server 梦江南 --from 2026-11-20 --out /tmp/mj.csv
 *   node scripts/price-history.mjs reindex
 *   node scripts/price-history.mjs compact --before 2026-06-01
 *   node scripts/price-history.mjs seed
 *
 * 价格单位为金。导出为“变化点”长表：所选范围首个快照点会输出全部当前值，
 * 之后只输出发生变化或消失的项；price 为空表示该服该物品已无有效报价。
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
  PRICE_HISTORY_TIMEZONE,
  compactPriceHistoryBefore,
  eachHistoryPoint,
  extractEffectiveValues,
  extractSelectedValues,
  listPriceHistoryDays,
  loadPriceHistoryDay,
  priceHistoryStateAt,
  readPriceHistoryIndex,
  rebuildPriceHistoryIndex,
  seedPriceHistory,
} from './lib/price-history.mjs';

const BOOLEAN_FLAGS = new Set(['all', 'help', 'json']);
const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_MINUTE_RE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}$/;
const DATE_SECOND_RE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}:\d{2}$/;

function parseArgv(argv) {
  const options = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--') {
      options._.push(...argv.slice(i + 1));
      break;
    }
    if (!arg.startsWith('--')) {
      options._.push(arg);
      continue;
    }
    const eq = arg.indexOf('=');
    if (eq >= 0) {
      options[arg.slice(2, eq)] = arg.slice(eq + 1);
      continue;
    }
    const name = arg.slice(2);
    if (BOOLEAN_FLAGS.has(name)) {
      options[name] = true;
      continue;
    }
    const next = argv[i + 1];
    if (next !== undefined && !next.startsWith('--')) {
      options[name] = next;
      i++;
    } else {
      options[name] = true;
    }
  }
  return options;
}

function parseTime(value, { endOfDay = false } = {}) {
  if (value === true || value === undefined || value === null || value === '') return null;
  const text = String(value).trim();
  if (DATE_ONLY_RE.test(text)) {
    return Date.parse(`${text}T${endOfDay ? '23:59:59' : '00:00:00'}+08:00`);
  }
  if (DATE_MINUTE_RE.test(text)) {
    return Date.parse(`${text.replace(' ', 'T')}:00+08:00`);
  }
  if (DATE_SECOND_RE.test(text)) {
    return Date.parse(`${text.replace(' ', 'T')}+08:00`);
  }
  const ms = Date.parse(text);
  if (!Number.isFinite(ms)) throw new Error(`无法识别时间：${value}（示例：2026-11-20 或 2026-11-20T10:30:00+08:00）`);
  return ms;
}

function loadAppData(root) {
  const file = path.join(root, 'assets', 'data.js');
  try {
    const source = fs.readFileSync(file, 'utf8');
    const sandbox = { window: {} };
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox);
    return sandbox.window.JX3Data || null;
  } catch {
    return null;
  }
}

function serverList(root, data) {
  const index = readPriceHistoryIndex(root);
  const map = new Map();
  for (const server of (index && index.servers) || []) {
    if (server && server.id) map.set(server.id, { id: server.id, name: server.name || server.id, region: server.region || '' });
  }
  for (const server of (data && data.servers) || []) {
    if (server && server.id) map.set(server.id, { id: server.id, name: server.name || server.id, region: server.region || '' });
  }
  return [...map.values()];
}

function itemCatalog(data) {
  const items = new Map();
  for (const item of (data && data.items) || []) {
    if (item && item.id) items.set(item.id, { kind: 'item', id: item.id, name: item.name || item.id });
  }
  for (const stone of (data && data.stones) || []) {
    if (!stone || stone.level === undefined) continue;
    const id = `stone:${stone.level}`;
    items.set(id, { kind: 'stone', id, level: String(stone.level), name: stone.name || `五行石（${stone.level}级）` });
  }
  return items;
}

function splitValues(value) {
  if (value === undefined || value === null || value === true) return [];
  return String(value).split(',').map((item) => item.trim()).filter(Boolean);
}

function resolveServers(value, servers) {
  const values = splitValues(value);
  if (!values.length) return null;
  return values.map((value) => {
    const hit = servers.find((server) => server.id === value || server.name === value);
    if (!hit) throw new Error(`未找到区服：${value}。可用区服：${servers.map((server) => server.name).join('、')}`);
    return hit.id;
  });
}

function resolveItems(value, catalog) {
  const values = splitValues(value);
  if (!values.length) return null;
  return values.map((value) => {
    if (catalog.has(value)) return value;
    const hit = [...catalog.values()].find((item) => item.name === value);
    if (!hit) throw new Error(`未找到物品：${value}。可用物品名见 assets/data.js 的 items / stones`);
    return hit.id;
  });
}

function itemName(catalog, kind, id, level) {
  const key = kind === 'stone' ? `stone:${level}` : id;
  const hit = catalog.get(key);
  if (hit) return hit.name;
  return kind === 'stone' ? `五行石（${level}级）` : id;
}

function serverName(servers, id) {
  const hit = servers.find((server) => server.id === id);
  return hit ? hit.name : id;
}

function formatGold(value) {
  if (value === null || value === undefined || value === '') return '';
  return Number(value).toFixed(2);
}

function table(rows, headers) {
  if (!rows.length) return '';
  const widths = headers.map((header) => String(header).length);
  for (const row of rows) {
    row.forEach((cell, index) => {
      widths[index] = Math.max(widths[index], String(cell ?? '').length);
    });
  }
  const line = (cells) => cells.map((cell, index) => String(cell ?? '').padEnd(widths[index])).join('  ').trimEnd();
  return [line(headers), line(widths.map((width) => '-'.repeat(width))), ...rows.map(line)].join('\n');
}

function csvCell(value) {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows, headers) {
  return [headers.map(csvCell).join(',')]
    .concat(rows.map((row) => row.map(csvCell).join(',')))
    .join('\r\n');
}

function rowRecord({ at, serverId, servers, catalog, kind, id, level, price, source = '本服报价' }) {
  return {
    at,
    serverId,
    server: serverName(servers, serverId),
    itemId: id,
    itemName: itemName(catalog, kind, id, level),
    kind: kind === 'stone' ? '五行石' : '物品',
    source,
    price: price === null || price === undefined ? null : Number(price),
  };
}

function printRows(rows, format, { out = '' } = {}) {
  const flat = rows.map((row) => [
    row.at,
    row.serverId,
    row.server,
    row.itemId,
    row.itemName,
    row.kind,
    row.source || '',
    formatGold(row.price),
  ]);
  const headers = ['时间', '区服ID', '区服', '物品ID', '物品名称', '类别', '价格来源', '价格(金)'];
  if (format === 'json') {
    const text = JSON.stringify(rows, null, 2) + '\n';
    if (out) {
      fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
      fs.writeFileSync(out, text, 'utf8');
      console.log(`已写入 ${out}（${rows.length} 行）`);
    } else {
      process.stdout.write(text);
    }
    return;
  }
  if (format === 'csv') {
    const text = (out ? '\ufeff' : '') + toCsv(flat, headers) + '\r\n';
    if (out) {
      fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
      fs.writeFileSync(out, text, 'utf8');
      console.log(`已写入 ${out}（${rows.length} 行）`);
    } else {
      process.stdout.write(text);
    }
    return;
  }
  console.log(table(flat, headers));
}

function listCommand(options, root) {
  const index = readPriceHistoryIndex(root);
  const days = listPriceHistoryDays(root);
  const limit = options.limit === undefined ? 30 : Math.max(0, Number(options.limit) || 0);
  const shown = limit > 0 ? days.slice(-limit) : days;
  if (options.json) {
    console.log(JSON.stringify({ index, days: shown }, null, 2));
    return;
  }
  if (!days.length) {
    console.log('暂无物价历史。先运行 node scripts/price-history.mjs seed 或一次价格更新。');
    return;
  }
  const rows = shown.map((day) => [
    day.date,
    day.points,
    day.baseAt,
    day.lastAt,
    day.compacted ? '已折叠' : '',
  ]);
  console.log(table(rows, ['日期', '快照点', '起始', '最后', '备注']));
  const totalPoints = days.reduce((sum, day) => sum + (Number(day.points) || 0), 0);
  console.log(`\n共 ${days.length} 天 · ${totalPoints} 个快照点 · 时区 ${PRICE_HISTORY_TIMEZONE}${limit > 0 && shown.length < days.length ? ` · 仅显示最近 ${shown.length} 天（--limit 0 查看全部）` : ''}`);
}

function asOfCommand(options, root, { servers, catalog }) {
  const atText = options.at || options._[1];
  if (!atText) throw new Error('用法：node scripts/price-history.mjs as-of <时间> [--server 梦江南] [--effective] [--format table|json|csv]');
  const target = parseTime(atText, { endOfDay: true });
  const point = priceHistoryStateAt(root, new Date(target));
  if (!point) throw new Error(`在 ${atText} 之前没有可用的物价历史快照`);
  const serverIds = resolveServers(options.server, servers);
  const scoped = (options.effective ? extractEffectiveValues : extractSelectedValues)(point.state, { serverIds });
  const rows = [];
  for (const value of scoped.values()) {
    rows.push(rowRecord({
      at: point.at,
      serverId: value.serverId,
      servers,
      catalog,
      kind: value.kind,
      id: value.id,
      level: value.level,
      price: value.price,
      source: value.source,
    }));
  }
  rows.sort((a, b) => a.server.localeCompare(b.server, 'zh-CN') || a.itemName.localeCompare(b.itemName, 'zh-CN'));
  if (options.json || options.format === 'json') {
    const payload = {
      at: point.at,
      date: point.date,
      timezone: PRICE_HISTORY_TIMEZONE,
      coverage: point.coverage,
      catalogPrices: point.state.catalogPrices || {},
      stoneCatalogPrices: point.state.stoneCatalogPrices || {},
      prices: rows,
    };
    const text = JSON.stringify(payload, null, 2) + '\n';
    if (options.out) {
      fs.mkdirSync(path.dirname(path.resolve(options.out)), { recursive: true });
      fs.writeFileSync(options.out, text, 'utf8');
      console.log(`已写入 ${options.out}（${rows.length} 行）`);
    } else {
      process.stdout.write(text);
    }
    return;
  }
  if ((!serverIds || serverIds.length !== 1) && (options.format === 'csv' || options.format === 'json')) {
    printRows(rows, options.format, { out: options.out || '' });
    return;
  }
  if (!serverIds || serverIds.length !== 1) {
    const counts = new Map();
    for (const row of rows) counts.set(row.serverId, (counts.get(row.serverId) || 0) + 1);
    const summary = [...counts.entries()]
      .map(([id, count]) => [serverName(servers, id), id, count])
      .sort((a, b) => a[0].localeCompare(b[0], 'zh-CN'));
    console.log(`快照时间：${point.at}（${point.date}）`);
    console.log(table(summary, ['区服', '区服ID', '有报价条目']));
    console.log('\n加 --server 梦江南 可展开某个区服的完整价格；加 --format json 可输出结构化数据。');
    return;
  }
  printRows(rows, options.format || 'table', { out: options.out || '' });
}

function changeRowsCommand(options, root, { servers, catalog }, { requireScope }) {
  const serverIds = resolveServers(options.server, servers);
  const itemIds = resolveItems(options.item, catalog);
  if (requireScope && !serverIds && !itemIds && !options.all) {
    throw new Error('请用 --server 或 --item 限定范围；确定要导出全部 17 服 × 267 物品时加 --all');
  }
  const from = parseTime(options.from, { endOfDay: false }) ?? Number.NEGATIVE_INFINITY;
  const to = parseTime(options.to, { endOfDay: true }) ?? Number.POSITIVE_INFINITY;
  if (from > to) throw new Error('--from 不能晚于 --to');
  const scope = {
    serverIds: serverIds || null,
    itemIds: itemIds || null,
  };
  const extract = options.effective ? extractEffectiveValues : extractSelectedValues;
  const rows = [];
  let previous = new Map();
  let baselineDone = false;
  eachHistoryPoint(root, (point) => {
    const atMs = Date.parse(point.at);
    if (atMs > to) return false;
    const current = extract(point.state, scope);
    if (atMs >= from) {
      if (!baselineDone) {
        for (const value of current.values()) {
          rows.push(rowRecord({
            at: point.at,
            serverId: value.serverId,
            servers,
            catalog,
            kind: value.kind,
            id: value.id,
            level: value.level,
            price: value.price,
            source: value.source,
          }));
        }
        for (const [key, value] of previous.entries()) {
          if (!current.has(key)) {
            rows.push(rowRecord({
              at: point.at,
              serverId: value.serverId,
              servers,
              catalog,
              kind: value.kind,
              id: value.id,
              level: value.level,
              price: null,
              source: '',
            }));
          }
        }
        baselineDone = true;
      } else {
        for (const [key, value] of current.entries()) {
          const before = previous.get(key);
          if (!before || before.price !== value.price || before.source !== value.source) {
            rows.push(rowRecord({
              at: point.at,
              serverId: value.serverId,
              servers,
              catalog,
              kind: value.kind,
              id: value.id,
              level: value.level,
              price: value.price,
              source: value.source,
            }));
          }
        }
        for (const [key, value] of previous.entries()) {
          if (!current.has(key)) {
            rows.push(rowRecord({
              at: point.at,
              serverId: value.serverId,
              servers,
              catalog,
              kind: value.kind,
              id: value.id,
              level: value.level,
              price: null,
              source: '',
            }));
          }
        }
      }
    }
    previous = current;
    return true;
  });
  if (options.all && !serverIds && !itemIds) {
    console.error(`[warn] --all 导出全部区服/物品的变化点，共 ${rows.length} 行；建议加 --server 或 --item 缩小范围。`);
  }
  return { rows, serverIds, itemIds };
}

function seriesCommand(options, root, context) {
  if (!options.server) throw new Error('series 需要 --server');
  if (!options.item) throw new Error('series 需要 --item');
  const { rows } = changeRowsCommand(options, root, context, { requireScope: true });
  if (!rows.length && !options.effective) {
    console.error('[hint] 该范围没有本服报价变化；若要看基准价补齐后的有效价，请加 --effective。');
  }
  printRows(rows, options.format || 'table', { out: options.out || '' });
}

function exportCommand(options, root, context) {
  const { rows } = changeRowsCommand(options, root, context, { requireScope: true });
  if (!rows.length && !options.effective) {
    console.error('[hint] 该范围没有本服报价变化；若要看基准价补齐后的有效价，请加 --effective。');
  }
  printRows(rows, options.format || 'csv', { out: options.out || '' });
}

function reindexCommand(root, data) {
  const index = rebuildPriceHistoryIndex(root, data);
  console.log(`已重建索引：${index.days.length} 天 · ${index.itemCount} 物品 · ${index.servers.length} 区服 · ${index.updatedAt || '无快照'}`);
}

function compactCommand(options, root, data) {
  const before = options.before;
  if (!before || !DATE_ONLY_RE.test(String(before))) throw new Error('用法：node scripts/price-history.mjs compact --before YYYY-MM-DD');
  const count = compactPriceHistoryBefore(root, String(before), data);
  console.log(`已把 ${count} 天的日内变化折叠为当日最后快照（${before} 之前）。原始明细未删除时可从 git 历史找回。`);
}

function seedCommand(options, root, data) {
  if (!data) throw new Error('无法读取 assets/data.js');
  const at = options.at ? String(options.at) : null;
  const result = seedPriceHistory(root, data, at);
  if (result.created) {
    console.log(`已建立初始快照：${result.file}（${result.day.base.at}）`);
  } else if (result.appended) {
    console.log(`已追加快照：${result.file}`);
  } else {
    console.log(`未写入：${result.skipped || '当前价格已是最新'}（${result.file || ''}）`);
  }
}

function help() {
  return `剑网三物价助手 · 物价历史查询 / 导出

数据目录：data/price-history/
  index.json             日期、快照点数、区服索引
  days/YYYY-MM-DD.json   当日完整 base + 后续价格变化增量

用法：
  node scripts/price-history.mjs list [--limit 30] [--json]
  node scripts/price-history.mjs as-of <时间> [--server 梦江南] [--effective] [--format table|json|csv]
  node scripts/price-history.mjs series --server 梦江南 --item 蜂王浆 [--from 日期] [--to 日期] [--effective] [--format table|csv|json]
  node scripts/price-history.mjs export --server 梦江南 [--item 物品] [--from 日期] [--to 日期] [--effective] [--format csv|json] [--out 文件]
  node scripts/price-history.mjs reindex
  node scripts/price-history.mjs compact --before YYYY-MM-DD
  node scripts/price-history.mjs seed [--at 时间]

说明：
  · 时间默认按 Asia/Shanghai 解释；只写日期时，as-of/to 取当天 23:59:59。
  · series/export 输出变化点：范围内首个快照点给出全部当前值，之后只列变化；
    价格为空表示该服该物品在此时已无有效报价。
  · 五行石用 stone:<等级> 表示，例如 --item stone:6。
  · --effective 用当日基准价补齐本服无报价的物品，输出与实际收益计算一致的“有效价”，
    价格来源列区分“本服报价 / 基准价”。
  · --all 才能不加 --server/--item 导出全部数据，输出会很大。
  · reindex 会重建 index.json；compact 会把指定日期前的日内变化折叠为当日最后快照。
`;
}

function main() {
  const root = path.resolve(process.cwd());
  const options = parseArgv(process.argv.slice(2));
  const command = options._[0] || (options.help ? 'help' : 'list');
  const data = loadAppData(root);
  const servers = serverList(root, data);
  const catalog = itemCatalog(data);

  if (command === 'help' || options.help) {
    process.stdout.write(help());
    return;
  }
  if (command === 'list' || command === 'ls') {
    listCommand(options, root);
    return;
  }
  if (command === 'as-of' || command === 'snapshot') {
    asOfCommand(options, root, { servers, catalog });
    return;
  }
  if (command === 'series') {
    seriesCommand(options, root, { servers, catalog });
    return;
  }
  if (command === 'export') {
    exportCommand(options, root, { servers, catalog });
    return;
  }
  if (command === 'reindex') {
    reindexCommand(root, data);
    return;
  }
  if (command === 'compact') {
    compactCommand(options, root, data);
    return;
  }
  if (command === 'seed') {
    seedCommand(options, root, data);
    return;
  }
  throw new Error(`未知命令：${command}\n\n${help()}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`[error] ${err.message}`);
    process.exitCode = 1;
  }
}

export {
  changeRowsCommand,
  loadAppData,
  parseTime,
  rowRecord,
};
