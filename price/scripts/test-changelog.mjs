import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { updateChangelog } from './update-changelog.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jx3-changelog-'));
const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
function commit(message) { git(['add', '.']); git(['commit', '-m', message]); return git(['rev-parse', 'HEAD']); }
try {
  git(['init', '-b', 'main']);
  git(['config', 'user.name', 'Changelog test']);
  git(['config', 'user.email', 'test@example.invalid']);
  fs.mkdirSync(path.join(root, 'content'));
  fs.writeFileSync(path.join(root, 'content/updates.json'), JSON.stringify({ title: '手写发布说明', notes: ['缺价不能为零'] }));
  const first = commit('fix: breakthrough calculation');
  updateChangelog(root);
  const notes = () => JSON.parse(fs.readFileSync(path.join(root, 'content/updates.json')));
  assert.equal(notes().title, '手写发布说明');
  assert.equal(notes().sourceCommit, first);
  const before = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
  commit('docs: update changelog');
  updateChangelog(root);
  assert.equal(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'), before, 'bot commit must not create a changelog loop');
  fs.writeFileSync(path.join(root, 'price.json'), '{"price":42}');
  commit('chore: update JX3BOX prices');
  updateChangelog(root);
  assert.equal(notes().title, '手写发布说明', 'price updates preserve application release notes');
  assert.match(fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8'), /update JX3BOX prices/);
  fs.writeFileSync(path.join(root, 'feature.js'), 'new feature');
  const next = commit('feat: 自动发布\n\n- 自动部署 Pages\n- 自动维护日志');
  updateChangelog(root);
  assert.equal(notes().sourceCommit, next);
  assert.equal(notes().title, '自动发布');
  assert.deepEqual(notes().notes, ['自动部署 Pages', '自动维护日志']);
  const stable = fs.readFileSync(path.join(root, 'content/updates.json'), 'utf8');
  updateChangelog(root);
  assert.equal(fs.readFileSync(path.join(root, 'content/updates.json'), 'utf8'), stable);
  console.log('PASS: manual notes, new commits, price updates, bot recursion and idempotency.');
} finally { fs.rmSync(root, { recursive: true, force: true }); }
