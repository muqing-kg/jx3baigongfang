# 剑网3 生活技艺 Excel 工作台

把网页版的「总览」「技艺收益」「五行石」「技艺突破路线」重做成一个可离线计算、可远程刷新物价的 Excel 工作簿。

- 无宏静态版：`剑网3技艺收益与突破.xlsx` · <https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-excel.xlsx>
- 无宏自动版：`剑网3技艺收益与突破-auto.xlsx` · <https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-excel-auto.xlsx>
- 宏版（带「检查物价更新」按钮）：`剑网3技艺收益与突破.xlsm` · <https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-excel.xlsm>
- 物价 JSON：<https://cherishxie.github.io/JX3-AH-Calculator/prices.json>
- 物价 CSV：<https://cherishxie.github.io/JX3-AH-Calculator/prices.csv>
- Web 查询文件：<https://cherishxie.github.io/JX3-AH-Calculator/downloads/jx3-price-refresh.iqy>

## 1. 工作簿结构

| Sheet | 说明 |
| --- | --- |
| 说明 | 快速开始、刷新方式、口径与边界、数据来源 |
| 总览 | KPI、TOP 10、按技艺汇总、八技艺突破净收益、采集 vs 制造、双图 |
| 设置 | 服务器、税率、成本口径、产量口径、突破策略、精力预算、经验模型 |
| 技艺收益 | KPI、TOP 20、按技艺汇总、采集 vs 制造、满精力贪心分配、柱状图 |
| 五行石 | 1-8 行情、快速合成、配方对比、3-6 推荐、7/8 爆率盈亏线 |
| 突破路线 | 所选技艺 1→50 逐级路线、30/35/40/45 晋秩材料、八技艺横评与净收益图 |
| 物价 | 1367 物品 × 17 服务器 × 行情/突破双价（39 列）；远程刷新的落点 |
| 物品 / 配方收益 | 267 个目录物品、175 条配方；成本、税后产值、利润、精力收益 |
| 材料明细 / 产物明细 | 配方—材料/产物长表，供 SUMIFS 汇总 |
| 配方产出 | 每配方 × 每产物的单位成本，供「取最低」逐层比较 |
| 突破配方 / 突破物品 / 突破材料 / 突破产物 / 采集产物 | 1057 条突破候选配方（含 21 条采集）及其经济性 |
| 突破晋秩 / 路线明细 | 127 条晋秩材料行、8 技艺 × 49 级的路线计算底表 |
| 分配 / 服务器 | 满精力贪心分配底表；下拉源（隐藏） |

主表已冻结窗格、加筛选、条件格式与图表。修改「设置」后所有结果立即重算。

## 2. 口径

- 成本 = Σ 材料数量 × 采用成本 + 手续费
- 税后产值 = Σ 产物数量 × 概率 × 市场价 × (1 − 税率)
- 利润 = 税后产值 − 成本
- 精力收益 = 利润 ÷ 单次精力
- 突破总净收益 = 1→50 制作利润 − 30/35/40/45 晋秩材料成本
- 金最优 = 利润/经验最高；省心 = 制作次数最少（次数相同再比利润/经验）
- Excel 端不提供「精力最优」：它需要 49 级 × 1000 配方的逐级 ceil，重算量过大；请在网页版查看该策略
- 突破经验门槛按用户观测点重算：1→2 250、3→4 510、8→9 1150、11→12 1370、14→15 1410、30→31 1650；点间线性插值，31 级起按 14→30 段 +15/级外推，四舍五入到 10，1→50 合计 **72,580** 经验；采集每次 80 经验
- 本工作簿按用户 2026-11-19 观测点重算（72,580），不采用线上当前的校准模型（72,480）；以「经验门槛」表为准
- 突破按市场价；「取最低」只用于技艺收益，和网页版默认口径一致

行情价（D:T）用于技艺收益：JX3BOX 本服报价 > 基准价。  
突破价（U:AL）用于突破：JX3BOX 本服报价 > 突破快照；缺失即缺价，不回退基准价。  
这与网页版 `seedPrice` / `priceOfIndex` 的差异保持一致。

## 3. 刷新物价

GitHub Action 每天 08:53–22:53 每两小时从 JX3BOX 拉取全服拍卖，更新 `assets/data.js`，随后 Pages 构建生成：

- `prices.json`：扁平记录数组，39 列，列名与「物价」表完全一致
- `prices.csv`：UTF-8 BOM，WPS/其他表格可直接打开
- `prices.html`：单张 HTML 表，供 Excel 传统 Web 查询

### 3.1 宏版一键检查（`.xlsm`）

1. 打开 `jx3-excel.xlsm`，启用宏；
2. 每次打开会自动静默刷新一次（`Workbook_Open` → `RefreshPrices True`）；
3. 也可点「总览」左上角 **检查物价更新** 手动刷新；
4. 宏用 Excel 原生 **Web Query** 导入 `prices.html`（39 列 HTML 表），不依赖 Power Query，也不需要解析 JSON；
5. 网络失败/表格导入失败时保留工作簿内置快照，不会清空。

这条 Web Query 路径在 Windows/Mac Excel 上都比 Power Query 的 Web 连接器更稳；WPS 是否支持 QueryTables 取决于版本。

### 3.2 无宏自动版（`-auto.xlsx`，打开时刷新）

`jx3-excel-auto.xlsx` 把 Power Query「物价自动」**直接加载到「物价」A1**，并开启「打开文件时刷新」。打开 Excel 时会自动请求 `prices.json`，不需要宏。

「物价」查询表已预填生成时快照：Excel 刷新成功会替换为最新；刷新失败或使用不支持 Power Query 的 WPS/LibreOffice 时，仍能看到快照，不会空表。需要固定离线数据时用静态 `.xlsx`。

### 3.3 Excel 365 手动建查询（无宏 `.xlsx`）

1. 数据 → 获取数据 → 其他源 → 空白查询；
2. 开始 → 高级编辑器，粘贴 `物价查询.pq` 的内容并完成；
3. 关闭并上载至 → 现有工作表 → `物价!$A$1`；
4. 数据 → 全部刷新；在「连接属性」勾选「打开文件时刷新」。

之后每次打开工作簿会自动拉取最新 JSON；也可以随时手动「全部刷新」。

### 3.4 Excel for Mac / 旧版（HTML Web 查询）

Excel for Mac 的 Power Query 不支持 HTML 连接器，但传统 Web 查询仍可用：

1. 下载 `物价刷新.iqy`；
2. 数据 → 获取外部数据 → 运行 Web 查询，选择该文件；
3. 输出到「物价」A1；
4. 之后使用「全部刷新」或连接属性中的「打开文件时刷新」。

### 3.5 WPS / LibreOffice（本地刷新脚本）

WPS 和 LibreOffice 都不支持 Power Query，WPS 也没有 Excel 的 Web Query / 宏刷新，打开工作簿只会显示内置快照。用脚本把最新价写进去：

1. 把工作簿放在本机（例如 `~/Downloads`）；
2. 双击 [`刷新物价.command`](./刷新物价.command)（或把工作簿拖到它上面）；
3. 脚本从 Pages 下载最新 `prices.csv`，只改「物价」表的数值（D:AL 与「数据时间」），图表、格式、宏都保留，然后自动用 WPS 打开；原文件会备份为 `.bak`；
4. 脚本会写入「打开时强制重算」，WPS 打开后按新价格重算所有公式；若数字没变化，按 `F9`（或「公式 → 重算」）。

命令行等价（不需要 WPS）：

```bash
python3 scripts/excel-patch-prices.py \
  --workbook "剑网3技艺收益与突破.xlsx" \
  --csv https://cherishxie.github.io/JX3-AH-Calculator/prices.csv \
  --in-place
```

另外，Pages 上的下载链接（`jx3-excel*.xlsx` / `.xlsm`）现在每次发布都会把当次最新物价写进内置快照，所以「重新下载最新文件」在 WPS 里打开也是当前价，只是不会像 Excel 那样自动再刷新。

### 3.6 关于「定时」

Excel 桌面端没有原生的定时 HTTP 刷新。这里的定时由 GitHub Action 完成：数据源每两小时更新一次；Excel 端在打开文件或手动刷新时取最新快照。若需要桌面端无人值守刷新，可在 Windows 任务计划程序 / macOS launchd 中定时打开工作簿并执行「全部刷新」后保存，但这属于外部调度，不在工作簿内。

## 4. 重新生成

```bash
# 1. 从 assets/data.js + breakthrough-data.js 提取统一模型
python3 excel/prepare_data.py

# 2. 生成工作簿
python3 excel/build_workbook.py

# 3. 用 LibreOffice 重算并写回缓存
#    （用 office-recalculate / soffice 均可）

# 4. 生成宏版：VBA Web Query + 按钮 + VML 控件
pip install pyOpenVBA
python3 excel/build_xlsm.py

# 5. 生成 Pages 物价订阅
node scripts/build-excel-prices.mjs _site
```

`prepare_data.py` 会做依赖环检测；当前 175 条目录配方无环，因此「取最低」可以展开为普通公式。

## 5. 验证

- 在 2026-11-19 快照 + 本经验表下，金最优、省心逐级核对 0 差异；Excel 端不提供精力最优。
- 金最优/省心的筛选口径与网页版一致；次数、精力、利润按本工作簿的用户经验表重算。
- 满精力分配给与网页版 `Calc.simulate` 一致的贪心结果。

生成脚本：`excel/prepare_data.py`、`excel/build_workbook.py`、`excel/build_xlsm.py`；物价订阅：`scripts/build-excel-prices.mjs`。

## 6. 已知边界

- 「精力最优」不在 Excel 端提供；需要逐级 ceil，请在网页版查看。
- 五行石「配方对比」按材料直接购买价计算；逐层自制的最优金币/精力/收益三套方案（含 3-6 级递归计划）请在网页版「五行石」页查看。
- 宏版需要启用宏并允许外部数据连接；不信任宏时请用无宏 `.xlsx` + Web 查询/CSV。
- `-auto.xlsx` 无宏，预填快照 + Excel Power Query 打开刷新；WPS/LibreOffice 不支持查询，但能看到快照；WPS 用户双击 `刷新物价.command` 把快照换成最新价。
- 突破路线按市场价；「取最低」仅用于技艺收益。
- 逐级经验门槛为本工作簿「经验门槛」表的用户观测+插值/外推；可直接改 B 列重算。采集经验与部分掉率仍为估算/示例。
- 百脉根、紫花苜蓿、甜象草、皇竹草在 JX3BOX 暂无物品键，只用目录基准价。
- 无宏 `.xlsx` 不含任何脚本；宏版 `.xlsm` 包含 `CheckPriceUpdate` / `RefreshPrices` 宏，用 Web Query 导入 `prices.html`。
