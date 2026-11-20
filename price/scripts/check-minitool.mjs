#!/usr/bin/env node
/**
 * Static audit for the 小红书小工具 bundle.
 *
 * The container is offline, runs classic scripts (no modules), and blocks
 * inline scripts / inline event handlers. This script fails fast before the
 * zip is built, so CI cannot publish an artifact that violates the sandbox.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('minitool');
const errors = [];
const warnings = [];
const ZIP_LIMIT = 10 * 1024 * 1024;
const UNZIPPED_LIMIT = 30 * 1024 * 1024;
const SOFT_FILE_LIMIT = 2 * 1024 * 1024;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

if (!fs.existsSync(path.join(root, 'index.html'))) {
  console.error('ERROR: minitool/index.html is missing (zip root must contain index.html)');
  process.exit(1);
}

const files = walk(root);
let total = 0;
for (const file of files) {
  const rel = path.relative(root, file);
  const size = fs.statSync(file).size;
  total += size;
  if (size > ZIP_LIMIT) errors.push(`${rel}: ${size} bytes exceeds the 10 MiB zip limit`);
  else if (size > SOFT_FILE_LIMIT) warnings.push(`${rel}: large file (${(size / 1024 / 1024).toFixed(1)} MiB)`);
}

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = html.match(/<script\b[^>]*>/gi) || [];
for (const tag of scripts) {
  if (!/\bsrc\s*=/.test(tag)) errors.push('index.html contains an inline <script> (src required)');
}
if (/<script\b[^>]*type\s*=\s*["']module["']/i.test(html)) errors.push('index.html uses type="module" (classic scripts only)');
if (/\son[a-z]{3,}\s*=/i.test(html)) errors.push('index.html contains an inline event handler (on*=)');
if (/\b(?:src|href|srcset)\s*=\s*["'](?:https?:)?\/\//i.test(html)) errors.push('index.html references an external http(s) resource');

for (const url of html.match(/(?:src|href)="([^"]+)"/g) || []) {
  const value = url.replace(/^(?:src|href)="/, '').replace(/"$/, '');
  if (value.startsWith('data:') || value.startsWith('#') || /^(https?:)?\/\//.test(value)) continue;
  const clean = value.split('?')[0].split('#')[0];
  if (clean && !fs.existsSync(path.join(root, clean))) errors.push(`index.html references a missing file: ${clean}`);
}

const banned = [
  [/\bfetch\s*\(/, 'fetch()'],
  [/XMLHttpRequest/, 'XMLHttpRequest'],
  [/WebSocket/, 'WebSocket'],
  [/\bwindow\.open\s*\(/, 'window.open()'],
  [/navigator\.clipboard/, 'navigator.clipboard'],
  [/document\.execCommand\s*\(/, 'document.execCommand()'],
  [/\bnew Worker\b/, 'Worker'],
  [/WebAssembly/, 'WebAssembly'],
  [/^\s*(?:import|export)\s/m, 'ES module syntax'],
];

for (const file of files.filter((f) => f.endsWith('.js'))) {
  const rel = path.relative(root, file);
  const code = fs.readFileSync(file, 'utf8');
  for (const [re, label] of banned) {
    if (re.test(code)) errors.push(`${rel}: uses ${label} (blocked by the offline sandbox)`);
  }
}

for (const file of files.filter((f) => f.endsWith('.css'))) {
  const rel = path.relative(root, file);
  const css = fs.readFileSync(file, 'utf8');
  if (/url\(\s*["']?https?:\/\//i.test(css)) errors.push(`${rel}: references an external http(s) URL`);
}

if (total > UNZIPPED_LIMIT) errors.push(`unzipped bundle ${total} bytes exceeds the 30 MiB limit`);

if (warnings.length) for (const warning of warnings) console.warn('WARN ' + warning);

if (errors.length) {
  console.error('FAIL minitool:');
  for (const error of errors) console.error(' - ' + error);
  process.exit(1);
}

console.log(
  `PASS minitool: ${files.length} files, ${(total / 1024).toFixed(1)} KiB, ` +
  'no inline scripts, no external requests, classic scripts only'
);
