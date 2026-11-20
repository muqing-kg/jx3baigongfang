#!/usr/bin/env node
// 从真实提交生成仓库日志与站内更新说明；重复运行不会产生无意义提交。
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function updateChangelog(root = process.cwd()) {
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  const fields = git(['log', '-z', '--no-merges', '-200', '--format=%H%x00%aI%x00%s%x00%b']).split('\0');
  const entries = [];
  for (let i = 0; i + 3 < fields.length; i += 4) {
    const [sha, at, subject, body] = fields.slice(i, i + 4);
    if (/^docs: update changelog\b/i.test(subject)) continue;
    const date = new Date(new Date(at).getTime() + 8 * 3600000).toISOString().slice(0, 10);
    const title = subject.replace(/^(?:feat|fix|docs|chore|refactor|test|ci|build|perf)(?:\([^)]*\))?!?:\s*/i, '');
    const notes = body.split('\n').map(line => line.replace(/^\s*[-*]\s*/, '').trim()).filter(Boolean);
    entries.push({ sha, date, title, notes, price: /update\s+JX3BOX\s+prices/i.test(subject) });
  }
  if (!entries.length) throw new Error('No commits available for changelog');
  const escape = text => text.replace(/[\\`*_[\]<>]/g, '\\$&');
  const changelog = '# 更新日志\n\n由 GitHub Actions 根据最近 200 条提交自动维护；日期使用北京时间。价格更新也记录在此。\n\n' + entries.map(e =>
    `## ${e.date} · ${e.sha.slice(0, 7)}\n\n${escape(e.title)}\n` +
    (e.notes.length ? '\n' + e.notes.map(n => '- ' + escape(n)).join('\n') + '\n' : '')
  ).join('\n');
  const featured = entries.filter(e => !e.price);
  const latest = featured[0] || entries[0];
  const updatesPath = path.join(root, 'content/updates.json');
  let manual = {};
  if (fs.existsSync(updatesPath)) manual = JSON.parse(fs.readFileSync(updatesPath, 'utf8'));
  const notesCommit = git(['log', '-1', '--format=%H', '--', 'content/updates.json']);
  // 在业务提交中手写的发布说明优先；后续价格/日志机器人提交保持这份说明。
  const keepNotes = (notesCommit === latest.sha || manual.sourceCommit === latest.sha) && manual.title && Array.isArray(manual.notes) && manual.notes.length;
  const payload = {
    sourceCommit: latest.sha,
    date: latest.date,
    title: keepNotes ? manual.title : latest.title,
    notes: (keepNotes ? manual.notes : latest.notes.length ? latest.notes : [latest.title]).slice(0, 4),
    history: featured.slice(0, 6).map(e => ({ version: e.sha.slice(0, 7), date: e.date, title: e.title }))
  };
  fs.mkdirSync(path.dirname(updatesPath), { recursive: true });
  fs.writeFileSync(path.join(root, 'CHANGELOG.md'), changelog);
  fs.writeFileSync(updatesPath, JSON.stringify(payload, null, 2) + '\n');
  return { entries: entries.length, sourceCommit: latest.sha };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = updateChangelog();
  console.log(`CHANGELOG.md: ${result.entries} commits; release notes: ${result.sourceCommit.slice(0, 7)}`);
}
