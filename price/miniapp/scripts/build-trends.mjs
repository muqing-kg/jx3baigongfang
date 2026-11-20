#!/usr/bin/env node
/**
 * 把 Web 端的 data/price-history 打包成小程序可离线使用的精简快照。
 *
 * 输出：miniapp/src/shared/trends.json
 * 约束：
 * - 只保留最近 7 天，避免主包超过 2MB；
 * - 单文件超过 900KB 时自动减少天数；
 * - 数据只含历史价格，不含用户数据，可随小程序版本发布。
 *
 * 用法：npm run sync:trends（miniapp/ 下）或
 *       node miniapp/scripts/build-trends.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '..', '..');
const sourceDir = path.join(repo, 'data', 'price-history');
const outFile = path.join(repo, 'miniapp', 'src', 'shared', 'trends.json');
const MAX_DAYS = 7;
const MAX_BYTES = 900 * 1024;

if (!fs.existsSync(path.join(sourceDir, 'index.json'))) {
  throw new Error('缺少 data/price-history/index.json');
}

const index = JSON.parse(fs.readFileSync(path.join(sourceDir, 'index.json'), 'utf8'));
const all = (index.days || []).slice().sort(function (a, b) { return String(a.date).localeCompare(String(b.date)); });
if (!all.length) throw new Error('物价历史为空，先运行一次价格更新');

function loadDays(count) {
  const picked = all.slice(-count);
  return picked.map(function (entry) {
    const file = path.join(sourceDir, entry.file || ('days/' + entry.date + '.json'));
    if (!fs.existsSync(file)) throw new Error('缺少历史文件 ' + file);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  });
}

let count = Math.min(MAX_DAYS, all.length);
let days = loadDays(count);
let payload = null;
let bytes = 0;

while (true) {
  payload = {
    schema: 1,
    generatedAt: index.updatedAt || new Date().toISOString(),
    updatedAt: index.updatedAt,
    catalogVersion: index.catalogVersion,
    itemCount: index.itemCount,
    servers: index.servers || [],
    days: days
  };
  bytes = Buffer.byteLength(JSON.stringify(payload));
  if (bytes <= MAX_BYTES || count <= 1) break;
  count -= 1;
  days = loadDays(count);
}

if (bytes > MAX_BYTES) {
  throw new Error('单日历史仍超过 ' + (MAX_BYTES / 1024) + 'KB，请先压缩历史数据');
}

fs.writeFileSync(outFile, JSON.stringify(payload));
const points = days.reduce(function (n, d) { return n + 1 + ((d.samples || []).length); }, 0);
console.log('已生成', path.relative(process.cwd(), outFile));
console.log(days.length + ' 天 / ' + points + ' 个节点 / ' + (bytes / 1024).toFixed(1) + ' KB');
