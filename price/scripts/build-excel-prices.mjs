#!/usr/bin/env node
/**
 * Build the Excel price feed published on GitHub Pages.
 *
 *   node scripts/build-excel-prices.mjs [outputDir]
 *
 * Outputs prices.json / prices.csv / prices.html with the same columns as the
 * workbook's 物价 sheet:
 *   物品键, 物品名称, 类别,
 *   17 × 行情服务器, 17 × 突破·服务器, 基准价, 数据时间
 *
 * 行情价：JX3BOX 本服报价 > 基准价（供技艺收益使用）
 * 突破价：JX3BOX 本服报价 > 突破快照（供突破路线使用，不回退基准价）
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.resolve(process.argv[2] || path.join(ROOT, '_site'));

function loadGlobal(file, name) {
  const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  const value = sandbox.window[name];
  if (!value) throw new Error(`cannot load ${name} from ${file}`);
  return value;
}

const data = loadGlobal('assets/data.js', 'JX3Data');
const bt = loadGlobal('assets/breakthrough-data.js', 'JX3Breakthrough');
const mapping = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/jx3-item-map.json'), 'utf8'));

const servers = data.servers;
const serverIds = servers.map((s) => s.id);
const serverNames = servers.map((s) => s.name);
const timestamp = data.meta?.priceUpdatedAt || bt.meta?.priceUpdatedAt || '';

const btItems = bt.items || [];
const btIndexByKey = new Map();
btItems.forEach((item, idx) => btIndexByKey.set(item.k, idx));

const master = new Map();
for (const item of btItems) {
  master.set(item.k, {
    key: item.k,
    name: item.n,
    category: '突破',
    btIndex: btIndexByKey.get(item.k),
    catalogId: null,
    base: null,
  });
}

for (const item of data.items) {
  const key = mapping[item.name] || `catalog:${item.id}`;
  const row = master.get(key) || {
    key,
    name: item.name,
    category: '基础',
    btIndex: btIndexByKey.has(key) ? btIndexByKey.get(key) : null,
    catalogId: null,
    base: null,
  };
  row.catalogId = item.id;
  row.name = item.name;
  row.base = Number(item.base) || null;
  row.category = '基础';
  master.set(key, row);
}

for (const stone of data.stones || []) {
  const key = stone.itemId;
  if (!key) continue;
  const row = master.get(key) || {
    key,
    name: stone.name || key,
    category: '五行石',
    btIndex: btIndexByKey.has(key) ? btIndexByKey.get(key) : null,
    catalogId: null,
    base: null,
  };
  row.category = '五行石';
  row.base = Number(stone.base) || null;
  master.set(key, row);
}

const quotes = data.serverPrices || {};
const snapshots = bt.prices || {};
const stonePrices = data.stonePrices || {};

const rows = [...master.values()].map((row) => {
  const market = {};
  const breakthrough = {};
  for (let i = 0; i < servers.length; i++) {
    const sid = serverIds[i];
    const quote = row.catalogId ? Number(quotes[sid]?.[row.catalogId]) || 0 : 0;
    const snap = row.btIndex == null ? 0 : Number(snapshots[sid]?.[row.btIndex]) || 0;
    const stone = row.category === '五行石' ? Number(stonePrices[sid]?.[row.key]) || 0 : 0;
    const base = Number(row.base) || 0;

    // 行情：报价 > 五行石 > 基准价 > 快照
    let marketValue = quote || stone || base || snap || 0;
    // 突破：报价 > 五行石 > 快照；绝不回退基准价
    let btValue = quote || stone || snap || 0;
    market[sid] = marketValue > 0 ? Math.round(marketValue * 100) / 100 : null;
    breakthrough[sid] = btValue > 0 ? Math.round(btValue * 100) / 100 : null;
  }
  return {
    key: row.key,
    name: row.name,
    category: row.category,
    market,
    breakthrough,
    base: row.base,
  };
});

rows.sort((a, b) => {
  if (a.category !== b.category) return a.category === '基础' ? -1 : 1;
  return a.name.localeCompare(b.name, 'zh-CN') || a.key.localeCompare(b.key);
});

const records = rows.map((row) => {
  const record = {
    物品键: row.key,
    物品名称: row.name,
    类别: row.category,
  };
  for (let i = 0; i < servers.length; i++) record[serverNames[i]] = row.market[serverIds[i]];
  for (let i = 0; i < servers.length; i++) record[`突破·${serverNames[i]}`] = row.breakthrough[serverIds[i]];
  record['基准价'] = row.base;
  record['数据时间'] = timestamp;
  return record;
});

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUT_DIR, 'prices.json'), JSON.stringify(records), 'utf8');

const headers = [
  '物品键',
  '物品名称',
  '类别',
  ...serverNames,
  ...serverNames.map((n) => `突破·${n}`),
  '基准价',
  '数据时间',
];
const csvCell = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const csv = [headers.map(csvCell).join(',')]
  .concat(records.map((record) => headers.map((h) => csvCell(record[h])).join(',')))
  .join('\r\n');
fs.writeFileSync(path.join(OUT_DIR, 'prices.csv'), '\ufeff' + csv + '\r\n', 'utf8');

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
const fmt = (value) => (value === null || value === undefined || value === '' ? '' : Number(value).toFixed(2));
const htmlRows = records
  .map((record) => {
    const cells = headers.map((header) => {
      const value = record[header];
      const cls = typeof value === 'number' ? ' class="num"' : '';
      return `<td${cls}>${escapeHtml(header === '数据时间' ? value : typeof value === 'number' ? fmt(value) : value ?? '')}</td>`;
    });
    return `<tr>${cells.join('')}</tr>`;
  })
  .join('\n');
const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>剑网3 物价订阅 · 百工坊</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,"Microsoft YaHei",sans-serif;margin:24px;color:#1f2937;background:#f8fafc}
h1{font-size:20px;margin:0 0 6px}
p{color:#64748b;margin:0 0 16px;line-height:1.6}
table{border-collapse:collapse;font-size:12px;background:#fff}
th,td{border:1px solid #dce4ec;padding:4px 8px;white-space:nowrap}
th{background:#12324a;color:#fff;position:sticky;top:0}
td.num{text-align:right;font-variant-numeric:tabular-nums}
tr:nth-child(even) td{background:#f4f7fa}
</style>
</head>
<body>
<h1>剑网3 物价订阅</h1>
<p>数据源：JX3BOX 全服拍卖，由 GitHub Action 定时更新。快照时间：${escapeHtml(timestamp)}。Excel 可用「数据 → 自网站」导入本页表格，或直接读取 <a href="./prices.json">prices.json</a>。</p>
<table id="jx3-prices">
<thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead>
<tbody>
${htmlRows}
</tbody>
</table>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT_DIR, 'prices.html'), html, 'utf8');

console.log(`prices.json / prices.csv / prices.html · ${records.length} 行 × ${headers.length} 列 · ${timestamp}`);
