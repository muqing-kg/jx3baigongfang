/**
 * 构建百工坊站点：两个子站各自用自己的构建链，产物汇总到 dist/。
 *   dist/index.html   统一入口
 *   dist/homeland/    家园蓝图（Vite 构建产物）
 *   dist/price/       物价助手（静态站构建产物）
 *   dist/shell/       入口页共用素材
 */
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const isWin = process.platform === 'win32';

function run(cmd, args, cwd, env = {}) {
  console.log(`\n[build] ${cmd} ${args.join(' ')}  (${cwd})`);
  execFileSync(cmd, args, {
    cwd,
    stdio: 'inherit',
    env: { ...process.env, ...env },
    shell: isWin,
  });
}

/** GitHub Actions 里 python3 存在；本机 Windows 只有 python，用 shim 兜住。 */
function pythonShim() {
  const dir = join(root, '.cache', 'bin');
  if (!isWin) return dir;
  mkdirSync(dir, { recursive: true });
  const shim = join(dir, 'python3');
  writeFileSync(shim, '#!/bin/sh\nexec python "$@"\n');
  chmodSync(shim, 0o755);
  return dir;
}

function must(path, label) {
  if (!existsSync(path)) throw new Error(`构建产物缺失：${label} → ${path}`);
}

const shim = pythonShim();
const pathEnv = { PATH: `${shim}:${process.env.PATH}` };

console.log('[build] 1/3 家园蓝图');
run('pnpm', ['run', 'build:web'], join(root, 'homeland'), {
  ELECTRON_SKIP_BINARY_DOWNLOAD: '1',
});
must(join(root, 'homeland', 'apps', 'web', 'dist', 'index.html'), 'homeland/index.html');

console.log('[build] 2/3 物价助手');
run('bash', ['scripts/build-site.sh'], join(root, 'price'), pathEnv);
must(join(root, 'price', '_site', 'index.html'), 'price/index.html');

console.log('[build] 3/3 汇总到 dist/');
// Windows 下 excel 补丁脚本偶尔无法删除被占用的临时文件，丢弃残留再汇总
const downloads = join(root, 'price', '_site', 'downloads');
if (existsSync(downloads)) {
  for (const name of readdirSync(downloads)) {
    if (name.startsWith('tmp')) rmSync(join(downloads, name), { force: true });
  }
}
rmSync(join(root, 'price', '_site', 'CHANGELOG.md'), { force: true });
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'index.html'), join(dist, 'index.html'));
cpSync(join(root, 'shell', 'logo'), join(dist, 'shell', 'logo'), {
  recursive: true,
  filter: (src) => !src.endsWith('source.png'),
});
cpSync(join(root, 'homeland', 'apps', 'web', 'dist'), join(dist, 'homeland'), { recursive: true });
cpSync(join(root, 'price', '_site'), join(dist, 'price'), { recursive: true });

for (const [file, label] of [
  ['homeland/index.html', '家园蓝图入口'],
  ['price/index.html', '物价助手入口'],
  ['shell/logo/logo-192.png', '共用 logo'],
  ['price/sw.js', '物价助手 Service Worker'],
]) {
  must(join(dist, file), label);
}
console.log('\n[build] 完成 → dist/');
