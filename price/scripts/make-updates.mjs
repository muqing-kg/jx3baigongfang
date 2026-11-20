#!/usr/bin/env node
/**
 * 生成 GitHub Pages 上的 updates.json。
 *
 * - 手动更新说明放在 content/updates.json（title / notes / history）。
 * - 每日价格机器人提交时自动换成“价格数据更新”文案。
 * - 版本号由 build-site.sh 传入，通常是当前 commit 短 SHA。
 *
 * 用法：node scripts/make-updates.mjs <version> <date> <out>
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const [, , versionArg, dateArg, outArg] = process.argv;
const version = versionArg || 'dev';
const date = dateArg || new Date().toISOString();
const out = outArg || '_site/updates.json';

function git(command, fallback) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return fallback;
  }
}

let manual = {};
try {
  manual = JSON.parse(fs.readFileSync('content/updates.json', 'utf8'));
} catch {
  manual = {};
}

const subject = git('git log -1 --pretty=%s', '');
const isPriceUpdate = /update\s+JX3BOX\s+prices/i.test(subject);

// 更新提示只应在“应用壳”变化时出现；价格数据单独更新不会改变壳版本，
// 因此这里优先使用 content/updates.json 中为本次应用发布手写的文案。
// 只有手写文案缺失时，才退回提交标题/价格机器人文案。
const hasManualNotes = manual && manual.title && Array.isArray(manual.notes) && manual.notes.length > 0;
const title = hasManualNotes
  ? manual.title
  : (isPriceUpdate ? '价格数据已更新' : (subject || '体验与数据更新'));

const notes = hasManualNotes
  ? manual.notes
  : (isPriceUpdate
      ? [
          '同步 JX3BOX 全服拍卖价',
          '重算制造配方成本与精力收益',
          '无报价物品回退梦江南示例价'
        ]
      : ['修复已知问题', '优化加载与交互']);

const payload = {
  // latest 是“发布 ID”，故意与 appVersion 区分：
  // 旧版 PWA 逻辑用 latest 对比页面版本，必须能感知到新版本。
  latest: version + '-r',
  appVersion: version,
  version,
  date,
  title,
  notes: notes.slice(0, 4).map(String),
  history: Array.isArray(manual.history) ? manual.history.slice(0, 6) : []
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(payload, null, 2) + '\n');
console.log(`updates.json: ${version} · ${title}`);
