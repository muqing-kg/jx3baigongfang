# 小红书小工具离线包（minitool）

本目录产物是把 Web 版 `剑网三物价助手` 适配成小红书小工具容器可加载的 **离线 H5 zip**。

- 构建源目录：`minitool/`
- 上传产物：`剑网三物价助手-minitool.zip`
- 入口：zip 根目录 `index.html`
- 数据版本：`v3.6`（2026-11-19，含 17 服 serverPrices 与 1-8 级五行石行情）

## 适配内容

| 容器约束 | 处理 |
| --- | --- |
| 页面不能联网 | 所有 JS/CSS/数据/SVG 随包；运行时不发起任何网络请求 |
| 脚本必须外置、经典脚本 | `index.html` 仅用 `<script defer src>`，无内联脚本、无 module/import |
| 禁止行内事件 | 全部使用 `addEventListener` 事件委托 |
| 禁止文件下载 | CSV/JSON 改为页内只读文本，可长按/选中复制；PNG 导出按钮隐藏 |
| 禁止剪贴板 API | 不调用 `navigator.clipboard` / `execCommand` |
| 禁止外部链接 | 数据来源改为纯文本标签，不打开外链 |
| 本地缓存 | 优先 `window.xhs.miniTool.setStorage/getStorage`；方法缺失时回退 localStorage（仅兼容旧客户端/浏览器预览） |
| Chrome 61 / WebView 61 | 交付 JS 为 ES2017；CSS 补 Flex gap、`color-mix`、`inset`、`min()`、`:focus-visible` 等基线回退，并用行为检测加兼容 class |
| 首屏 | `index.html` 内置标题、说明、4 个占位 KPI 与加载状态；JS 失败时仍有可读内容 |
| 安全区 | `viewport-fit=cover` + `--safe-area-inset-*` / `env()` 回退 |

## 校验结果（静态审计）

```text
Node audit:   PASS: 1 file(s), 0 warning(s)  # zip 体积检查
Python audit: PASS: 10 file(s), 0 warning(s)
zip:          约 190 KB（14 个文件）
index.html:   zip 根目录
文件类型:     .html / .css / .js / .svg
外部请求:     0
内联脚本:     0
行内事件:     0
type=module:  0
外部资源引用: 0
```

同时完成：

- Web/浏览器预览：总览、技艺、价格、分析、**突破升级**、五行石、配方/公式详情、设置、价格编辑、导出文本均无控制台报错。
- 同页筛选滚动位置实测保持（`scrollY=300`，页面顶边不变）。
- 强制 `no-flex-gap` / `no-color-mix` / `no-inset` 兼容类后，390px 宽度无横向溢出。
- 注入模拟 `window.xhs.miniTool` Storage 后，改价 → 重载 → 价格仍保留。
- 未进行真实创服平台模拟器、Android 真机、iOS 真机验证；也未在 Chrome 61 实机运行，静态兼容层已补齐，但“真机性能/兼容性”仍需按发布流程实测。

## 发布前

1. 把 `剑网三物价助手-minitool.zip` 上传到小红书创服平台小工具上传页。
2. 先在平台模拟器完整验证：总览 → 价格改价 → 技艺列表 → 配方详情 → 分析 → 五行石 → 设置 → 数据说明。
3. 再分别用 Android 真机和 iOS 真机扫码验证同一 zip。
4. 若平台要求名称/类目/隐私说明，按“非官方玩家工具”填写；不要上传官方 Logo、游戏截图或交易/充值功能。

## 配套品牌素材

小工具图标与封面见 [brand/README.md](brand/README.md)：

- `brand/icon-1024.png`：创服平台图标主文件
- `brand/cover-3x4-1080x1440.png`：笔记首图/竖版封面
- `brand/cover-16x9-1200x675.png`：平台横版卡片备用

## 物价自动更新

离线包不能在运行时联网。更新价格请运行 `node scripts/update-jx3-prices.mjs`（或 `./scripts/update-prices.sh`），脚本会更新数据并重打本 zip；详细规则见 `scripts/README.md`。

突破升级数据（配方、晋秩材料、17 服价格）由 `node scripts/build-breakthrough-data.mjs` 生成，会同时写出 `assets/breakthrough-data.js` 与 `minitool/assets/breakthrough-data.js`（小工具版去掉外链 URL），并复制共用内核 `assets/breakthrough.js`；改完执行 `./scripts/build-minitool.sh` 重打 zip。
