# 部署与同步

## 线上地址

| 内容 | 地址 |
| --- | --- |
| Web 版 | https://cherishxie.github.io/JX3-AH-Calculator/ |
| 最新小工具 zip（稳定下载） | https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-minitool.zip |
| GitHub Actions | https://github.com/cherishXie/JX3-AH-Calculator/actions |
| 小红书创作服务平台 | https://creator.xiaohongshu.com/ |

Pages 发布的是仓库根目录的 Web 版（`index.html` + `assets/`）；小红书小工具仍是离线 zip，两者共用同一份业务代码和价格数据。

## 自动提交与发布

用户已授权后续完成修改和验证后自动提交推送，规则保存在根目录 `AGENTS.md`。本地执行 `./scripts/sync.sh "fix: 具体变化"` 会验证日志脚本与突破计算、构建站点和小工具，再提交推送。消息后可以追加本次文件路径，避免提交其他任务的修改。GitHub Action 无法读取本机未提交的文件。

推送 `main` 后，`Deploy site and minitool` 自动完成：

1. 验证并从真实提交生成 `CHANGELOG.md`、`content/updates.json`，提交日志变更。
2. 使用已验证且包含日志的同一提交构建 Pages 和离线小工具，部署 GitHub Pages。
3. 提供线上 `CHANGELOG.md`、`updates.json` 与稳定小工具下载地址。

不需要新增 PAT 或 Secret：日志步骤使用 `contents: write`，Pages 使用 `pages: write` 与 `id-token: write`。日志机器人的推送不会触发普通 push 工作流，部署由同一工作流的后续 job 完成；价格机器人的更新由已有 `workflow_run` 入口发布。日志使用北京时间；纯价格更新不会覆盖最近一次应用发布说明。

发布后必须确认 Action 成功，并核对线上 `version.json` / `updates.json`；失败不能报告为已上线。`workflow_dispatch` 可手动重跑发布。

> 微信小程序「精力做什么」单独发布：源码在 `miniapp/`，构建产物在 `miniapp/dist/weapp/`，AppID、备案、上传与提审流程见 [miniapp/WECHAT-DEPLOY.md](miniapp/WECHAT-DEPLOY.md)，头像见 [wechat/](wechat/README.md)。

## 一次配置（只做一次）

### 1. 开启 Pages

GitHub 仓库 → **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。

> `GITHUB_TOKEN` 不能代替用户开启 Pages，所以这一步必须手动点一次；开启后 `.github/workflows/deploy.yml` 才能部署。

### 2. 绑定远端

```bash
git remote add origin https://github.com/cherishXie/JX3-AH-Calculator.git
```

远端目前只有一个脚手架 commit（`LICENSE` / `README` / `.gitattributes`），本地是完整项目。首次推送二选一：

```bash
# 方式 A：合并远端脚手架（保留 LICENSE，推荐）
git fetch origin
git merge origin/main --allow-unrelated-histories
# README 冲突时保留本地版本
git push -u origin main
```

```bash
# 方式 B：确认远端没有有价值内容后，直接覆盖
git push --force-with-lease -u origin main
```

### 3. 触发第一次部署

推送后打开 Actions，等 **Deploy site and minitool** 跑完；Pages 首次发布通常 1–2 分钟。

## 每次更新

```bash
./scripts/sync.sh "feat: 更新配方数据"
```

脚本会：

0. **应用壳更新前先改 `content/updates.json`**：更新 `title` / `notes`，PWA 更新提示会显示这段文案；只更新价格数据时不会触发提示，也不会覆盖这段文案。
1. `scripts/check-minitool.mjs` 审计小工具（无内联脚本、无外网请求、无 module、≤10 MiB）；
2. `scripts/build-minitool.sh` 重打 `剑网三物价助手-minitool.zip`；
3. `scripts/build-site.sh` 生成 `_site/`（含 `downloads/jx3-minitool.zip`）；
4. 提交并推送；
5. Actions 自动：
   - 部署 Web 版到 GitHub Pages；
   - 上传小工具 zip 为 artifact，并随 Pages 发布到 `/downloads/jx3-minitool.zip`。

## iPhone 添加到主屏幕

- 必须用 **Safari** 打开 `https://cherishxie.github.io/JX3-AH-Calculator/`，微信/小红书/Chrome 的 iOS 内置浏览器不会显示“添加到主屏幕”。
- Safari → 分享 → 添加到主屏幕 → 添加。
- 网页不能通过 JS 直接触发该菜单；应用只在 iOS Safari 下显示步骤提示。
- 若菜单没有该项：退出私密浏览、检查“屏幕使用时间 → 内容和隐私访问限制”、确认 HTTPS、确认未重复添加。
- `icons/icon-180.png` 为 iOS 主屏幕图标；`manifest.webmanifest` 和 `sw.js` 提供独立窗口与离线应用壳。

## 行情更新提示

价格机器人只更新数据文件，不改变应用壳版本；页面内行情刷新不会弹出“发现新版本”卡片。PWA 更新卡只在 `manifest`/HTML/CSS/JS 等应用壳变化时出现。

## PWA 自动更新

站点现在是可安装的 PWA：

- `manifest.webmanifest` + `icons/`：可添加到主屏幕；
- `sw.js`：构建时注入**应用壳版本**（不含 `data.js`），缓存应用壳，代码新版本安装后进入 waiting 状态；
- `version.json` / `updates.json`：当前版本与本次更新说明；
- 页面检测到 waiting SW 后弹出更新提示，展示 `updates.json` 的标题和 notes；
- 点「立即更新」→ `skipWaiting` → `controllerchange` → 自动重载；`localStorage` 里的价格和配方保留；
- 点「稍后」本次会话不再提示，下次打开仍可更新。
- 价格数据 `assets/data.js` 单独缓存并网络优先：**定时价格更新不会生成新 SW、不会弹更新提示**，下次打开/刷新直接拿新价格；
- 只有 HTML/CSS/JS 等应用壳变化时才提示更新；点「立即更新」后更新卡会显示进度条和阶段文字，完成自动刷新；
- 更新中会展示「准备 → 切换 → 应用 → 刷新」进度，避免点击后无反馈；
- 360、Edge 等 Chromium 浏览器做了降级：宽度/安全区用回退值，按钮间距不用 flex gap，360 老内核也能正常显示提示卡。
- 页面打开期间全天检查 `version.json`：每小时 :06 和 :36 后各 15 分钟窗口每 2 分钟检查一次，其余时间每 5 分钟；发现 `dataUpdatedAt` 变化后拉取最新 `data.js`，在内存中合并并重绘当前页面；
- 页面顶部独立显示「行情更新」和「行情检查」两个时间：前者是 JX3BOX 报价最后变化时间，后者是本页最近一次成功检查行情的时间；两者不放在数据表格里。
- 刷新时顶部显示 loading（「行情更新中…」），完成后显示「行情已更新 · 时间」；不整页刷新、不弹 PWA 提示；
- 重绘会保留窗口滚动位置和表格横向滚动；抽屉/弹窗/输入框聚焦时自动延后，避免打断操作；
- 每小时 :31 后的 15 分钟窗口每 2 分钟检查一次，其余时间每 5 分钟；标签页重新可见时也会检查。
- 顶部刷新图标或「设置 → 应用 → 检查更新」可手动检测；没有新版本会提示「已是最新版本」。

更新内容来源：

- `content/updates.json`：手动维护 `title` / `notes` / `history`；
- 每日价格机器人提交（`chore: update JX3BOX prices`）会自动换成“价格数据已更新”三条说明；
- 想改某次更新的文案，提交前改 `content/updates.json` 即可。

本地验证：

```bash
SHELL_VERSION_OVERRIDE=1.0.0 ./scripts/build-site.sh
cd _site && python3 -m http.server 8940
# 打开 http://localhost:8940，等 Service Worker 激活
# 另开终端：SHELL_VERSION_OVERRIDE=2.0.0 ./scripts/build-site.sh
# 回到页面刷新/等待 15 分钟检查，或 DevTools → Application → Service Workers → Update
# 价格静默更新验证：只改 _site/assets/data.js 的 priceUpdatedAt 再刷新，
# 应看到版本不变、无更新提示、数据已变新。
```

注意：

- GitHub Pages 不能自定义 `Cache-Control`；SW 用 `updateViaCache: 'none'`，检测仍可能有几分钟延迟。
- 更新提示只在 HTTPS 或 localhost、且 `app-version` 已由构建替换时启用。
- 小红书小工具不加载 PWA（`minitool/index.html` 没有引用 `pwa.js`），继续保持离线 zip 形态。

### 小红书最后一步（人工）

小红书小工具**不能**像 Pages 一样全自动发布：

- 需要创作者账号扫码登录；
- 每次提审都要平台审核；
- 容器要求完全离线，价格只能在构建时写入。

所以 CI 负责“构建 + 校验 + 可下载”，发布保留一步人工：

1. 手机打开 https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-minitool.zip 下载；
2. 安装并登录官方 CLI：`npm i -g redskillhub-upload`，然后 `redapp login --agent`；
3. 上传 zip：`redapp upload --file "剑网三物价助手-minitool.zip" --type pkg --agent --dry-run`，核对回执后用同一个 `planHash` 执行 `--confirm "<PLAN_HASH>"`；
4. 生成预览二维码：`redapp preview --source thirdAgent --agent --file preview.json --qr-out preview.png`，手机扫码确认；
5. 送审：`redapp submit --source thirdAgent --agent --file submit.json --dry-run`，确认后 `--confirm "<PLAN_HASH>"`；
6. 审核通过后在创作服务平台点发布，再挂到笔记。

> 如果以后确实要全自动提交，可以把 CLI 的登录态放进 Actions secret，但每次 push 都会产生一个待审版本，且 token 失效会影响发布；不建议默认开启。

## 定时价格更新

价格更新由 **Cloudflare Worker Cron** 全天每 30 分钟 :06 / :36（北京时间）触发 `update-jx3-prices.yml` 的 `workflow_dispatch`，不再依赖 GitHub 的 `schedule`，也不限制 00:00–08:00。更新 `assets/data.js`、`minitool/assets/data.js`、`miniapp/src/shared/catalog.json` 并提交；提交完成后通过 `workflow_run` 自动触发 `deploy.yml`，同步 Pages 和小工具 zip。Cloudflare Worker 的配置与部署见 `cloudflare/price-cron/README.md`。

价格有变化时还会追加 `data/price-history/` 的按日 JSON。它随 Pages 发布在 `/price-history/`，可用 `node scripts/price-history.mjs` 回溯/导出；结构和命令见 `data/price-history/README.md`。

## 常见问题

- **Pages 404**：确认 Settings → Pages 的 Source 是 “GitHub Actions”；确认 deploy job 成功；首次发布等 1–2 分钟。
- **`configure-pages` 报 Pages not enabled**：回到 Settings → Pages 手动开启一次。
- **push 被拒，提示 OAuth App 不能改 workflow**：运行 `gh auth refresh -h github.com -s workflow` 后重试。
- **小工具 zip 超过 10 MiB**：`scripts/check-minitool.mjs` 会直接失败，先压缩素材或删无用文件。
- **页面更新了但手机还是旧版**：Pages CDN 有约 10 分钟缓存，强制刷新或换隐私窗口；小工具是离线包，必须重新上传并审核才会更新。
- **子路径**：Pages 地址带 `/JX3-AH-Calculator/`，项目内全部使用相对路径，无需改 `base`。
- **不要提交**：`_site/`、`JX3-AH-Calculator/`（本地脚手架 checkout）、`.DS_Store` 已在 `.gitignore` 中。
