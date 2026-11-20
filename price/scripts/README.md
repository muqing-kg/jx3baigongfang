# JX3BOX 自动更新物价

## 为什么是“构建时自动更新”

Web 版是静态页面，小红书小工具容器还要求**完全离线、不能联网**，所以不能在用户打开小工具时实时请求 JX3BOX。自动更新的正确位置是：

1. 在本地/CI 定时运行更新脚本；
2. 脚本从 JX3BOX 拉取 17 个服务器的拍卖价；
3. 重写 Web / Taro 小程序 / 小工具的 `data.js`（含 `serverPrices`）；
4. 重打 `剑网三物价助手-minitool.zip`；
5. 重新上传小工具并通过审核。

## 一键更新

```bash
# 先看会改什么，不写文件
node scripts/update-jx3-prices.mjs --dry-run

# 更新并重打小工具 zip
./scripts/update-prices.sh

# 只更新数据，不重打 zip
./scripts/update-prices.sh --no-zip

# 只更新某个服务器（默认更新全部 17 个）
./scripts/update-prices.sh --server 梦江南
```

脚本只依赖 Node 18+ 标准库，无需 `npm install`。

## 更新内容

- 拉取地址：`https://next2.jx3box.com/api/auction/`，`aggregate_type=hourly`，逐服拉取。
- 服务器：读取 `assets/data.js` 的 17 个服务器；数据写入 `data.serverPrices[serverId][itemId]`。
- 物品映射：`scripts/jx3-item-map.json`（267 项；4 项马草暂无 JX3BOX 映射）；
  新增物品会自动通过 JX3BOX 物品名接口解析并补入映射。
- 默认规则：
  - 样本数 `< 5` 的低样本报价不采用；
  - 报价超过当前示例价 `8 倍` 的异常值不采用；
  - 无公开报价的物品保留示例价。
- 各服覆盖率写入 `data.meta.serverCoverage`；某服无报价的物品回退梦江南样本。
- 更新文件：
  - `assets/data.js`（含 `serverPrices`）
  - `miniapp/src/shared/catalog.json`
  - `minitool/assets/data.js`
  - `data/price-history/`（价格有变化时）
  - `剑网三物价助手-minitool.zip`
- 价格更新不再修改 `seedVersion`；`seedVersion` 只随配方目录/结构变化，避免每次价格更新都触发本地数据迁移。
- 价格与上次完全一致时：不写文件、不重打 zip、不产生提交，避免每日空提交和 PWA 更新提示；
- 只有价格发生变化时才更新 `priceUpdatedAt`；时间统一按 `Asia/Shanghai` 生成。

## 物价历史 JSON（回溯 / 二次分析）

每次价格更新会把各服有效报价写入 `data/price-history/`，用于回溯某个区服、某个时间点的物价：

- `index.json`：日期、快照点数、区服索引；
- `days/YYYY-MM-DD.json`：当天第一个变化点的完整 `base`，后续只追加变化增量；
- 未发生价格变化的行情检查不写历史，因此也不会产生空提交；
- 除各服报价外，还保存当日目录基准价（`catalogPrices`），本服无报价时可用它还原实际收益口径。

```bash
node scripts/price-history.mjs list
node scripts/price-history.mjs as-of 2026-11-20T12:00 --server 梦江南
node scripts/price-history.mjs series --server 梦江南 --item 蜂王浆 --from 2026-11-20
node scripts/price-history.mjs export --server 梦江南 --from 2026-11-20 --effective --out /tmp/mj.csv
```

`--effective` 导出会用基准价补齐本服无报价物品，并标注价格来源，适合按时间点重算产出物收益。完整结构、字段和 `reindex` / `compact` 维护命令见 [`data/price-history/README.md`](../data/price-history/README.md)。

## Web 物价走势

分析模块的「物价走势」由 `assets/trends.js` 读取已发布的 `price-history/` JSON：

- 按当前区服回放每天的 `base` + `samples`，得到每个历史节点的本服报价/基准价/有效价；
- 支持按小时时间范围、材料/产物/五行石、技艺筛选；
- 筛选栏支持全部技艺/全部类型、多选/全选与价格区间；物品搜索位于多选面板内；跨技艺材料按实际配方用途展示；
- 所有物品平铺在同一张价格分布图和价格散点图中，不同物品独立配色；价格分布默认使用价格指数（首点 = 100）收敛 Y 轴范围，每个图表标题右侧可单独切换原始金币（对数）；
- 分布图展示最低/最高、25–75% 箱体、中位线；点击物品可查看单独折线，并同步定位分布与散点；
- 筛选栏默认全部技艺/全部类型并在滚动时固定，移动端可收起；提供涨跌红黑榜（前 10 + 全量）与区间涨跌热力图；各图表可下载 PNG；
- 原始数据按节点折叠，展开后可查看每个节点报价，并导出原始/走势 CSV；行情条支持手动检查远程物价，dev 预览自动使用生产行情。

该页面只存在于 Web 版；小红书离线小工具不加载历史 JSON。数据回归测试：

```bash
node scripts/test-trends.cjs
```

## Dev 预览

- 默认开发分支：`dev`，推送到 `dev` 会运行 `Deploy dev preview`。
- 线上地址：`https://cherishxie.github.io/JX3-AH-Calculator/dev/`，页面会显示 `DEV` 标识。
- 预览工作流会同时构建 `main` 根站点和 `dev` 子目录，避免 dev 部署把生产站清空。
- GitHub Pages 每个仓库只有一个站点；`Deploy site and minitool`（main）和 `Deploy dev preview`（dev）都会同时构建根站点与 `/dev/` 预览，因此主站部署不会清空 dev 预览。生产发布需用户明确同意后再执行 `BRANCH=main ./scripts/sync.sh`。

## 定时任务

本机兜底由 launchd 运行 `scripts/local-price-cron.sh`（Asia/Shanghai，每天 08:09–22:09、每 2 小时）：

```bash
./scripts/install-local-price-cron.sh           # 安装 / 更新定时任务
./scripts/install-local-price-cron.sh --status  # 查看 state / runs / 退出码
launchctl kickstart -k gui/$(id -u)/com.cherish.jx3-price-cron  # 立刻跑一次
tail -f /tmp/jx3-price-cron.log                 # 运行日志
```

- 每次在独立克隆 `~/.cache/jx3-price-cron` 里拉取最新 `main`、运行 `update-prices.sh`，价格有变化才提交并推送到 `main`；无变化时直接退出。
- 推送使用 `.deploy-key/jx3_deploy`，走 `deploy.yml` 自动部署 Pages 与小工具包。
- macOS 的 TCC 隐私保护会阻止 launchd 读取 `~/Documents`，plist 直接指向仓库里的脚本会以 `exit 126`（`Operation not permitted`）失败。因此安装脚本把 `local-price-cron.sh` 和 deploy key 复制到 `~/.local/share/jx3-price-cron`，plist 指向该副本。
- 改完 `scripts/local-price-cron.sh` 要重新执行安装脚本，实际运行的副本才会同步。

GitHub Actions 也可以直接执行 `./scripts/update-prices.sh`，然后提交变更/上传 artifact。

## 注意

- JX3BOX 是第三方数据源，接口可能限频或调整；脚本内置 3 次重试，但建议每天只跑 1–2 次。
- 自动更新的是**17 个服务器的拍卖样本**；覆盖率较低的服务器/物品会回退梦江南示例价，本服价格可在应用内逐项校准。
- 脚本不会自动改品牌封面上的 TOP 值/条数；封面数字变化时需要重新导出 `brand/cover-*.svg`。
- 自动更新后建议在 Web 总览、价格库、小工具模拟器各检查一次，再上传新 zip。

## GitHub Actions

主工作流 `.github/workflows/update-jx3-prices.yml` 由 Cloudflare Worker 全天每 30 分钟 :06 / :36 触发，更新 17 个服务器数据并提交，同时上传小工具 ZIP；GitHub Actions 不再配置 `schedule`。

定时由 `cloudflare/price-cron` 的 Cloudflare Worker 全天每 30 分钟 :06 / :36 触发 `workflow_dispatch`；GitHub Actions 不再配置 `schedule`。主任务通过 concurrency 串行执行，防止同时写价格。

排查时先按 `event=schedule` 查看 Actions 记录：没有记录表示 GitHub 尚未派发定时事件；存在失败记录则检查日志。`active` 和手动执行成功不能证明定时调度已生效。GitHub 的 schedule 可能延迟或漏发，因此备用检查也不能替代独立的外部调度器；Cloudflare 方案见 `cloudflare/price-cron/README.md`，需另行部署并配置凭据。若仓库受保护分支限制，可把 push 改为创建 PR。

---

# 突破升级数据构建

> 生成 `miniapp/src/shared/breakthrough.json` 的同时，会写出 Web `assets/breakthrough-data.js`、小工具 `minitool/assets/breakthrough-data.js`（去外链）并复制共用内核 `assets/breakthrough.js`。Web 端需再执行 `./scripts/build-site.sh`，小工具需再执行 `./scripts/build-minitool.sh`。

`scripts/build-breakthrough-data.mjs` 生成小程序「分析 → 突破升级」所需的数据（`miniapp/src/shared/breakthrough.json`）：

```bash
# 全量重建（配方 + 物品名 + 17 服价格，约 3–5 分钟）
node scripts/build-breakthrough-data.mjs

# 只刷新价格（沿用现有配方与物品）
node scripts/build-breakthrough-data.mjs --prices-only

# 只用现有价格重建配方
node scripts/build-breakthrough-data.mjs --skip-prices
```

## 数据来源

- 配方/经验/精力：`https://node.jx3box.com/manufactures?type=...&ids=...&client=std`，只保留 `RequireLevel` 1–50 的当前赛季配方；经验恒为精力的 2 倍，脚本按 `CostVigor` 写入。
- 物品名：`https://node.jx3box.com/api/node/item/{type}_{id}`。
- 各服价格：`https://next2.jx3box.com/api/auction/`，`铜 / 10000 = 金`。
- 30/35/40/45「晋秩」突破材料：JX3BOX 攻略《【苍生铸世】鱼历小药宴席改动 & 生活技艺升级攻略》<https://www.jx3box.com/bps/109793>；等级门槛与成就库「完成40级突破」交叉核验。

## 价格清洗

- 样本数 `< 5` 的挂单不采用；
- 拍卖接口对无成交物品返回的 `10000 金` 哨兵值剔除；
- 只有 1–2 个服务器有报价的物品视为流动性不足，剔除（有目录基准价的除外）；
- 单服价格偏离全服中位数 4 倍以上、或超过目录基准价 4 倍的剔除；
- 全部清洗后仍缺价的配方/材料会在页面上标记「缺价」，不参与最优路线计算。

## 估算口径

- 经验门槛配置为 `miniapp/src/shared/experience-model.json`：保留1→2=250、3→4=510、8→9=1150、11→12=1370、30→31=1650五个用户观测点；点间分段线性插值，31级起按最后一段280/19的斜率外推，推算值取整到10。1→50模拟合计72,480，不能视为游戏完整实测表；暂按八技艺共用门槛。
- 采集单次经验未公开：按 `80` 估算（制造经验 = 精力 ×2 的对称假设）。
- 页面底部与 `breakthrough.json.meta.disclaimer` 常驻说明这两项估算。

突破计算模型由 `miniapp/src/shared/breakthrough-model.js` 统一实现；运行 `node scripts/sync-breakthrough-model.mjs` 刷新目录物品报价 key 并同步 Web/小工具，`node scripts/test-breakthrough.cjs` 检查计算回归。逐级经验门槛尚未核实，不应将模型值当成游戏实测值；50 级只有满级节点，没有独立晋秩任务。
