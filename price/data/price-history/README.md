# 物价历史 JSON

这里保存每次 JX3BOX 价格更新产生的各服报价，用于回溯“某个区服在某个时间点的物价”，以及后续对产出物做二次分析。

## 目录

```text
data/price-history/
  index.json              日期索引：区服列表、每天的快照点数、起止时间
  days/2026-11-20.json    单日明细：完整 base + 后续变化增量
```

历史随日常价格更新自动写入：

- `chore: update JX3BOX prices` 提交会带上 `data/price-history`；
- 只有价格真正变化时才追加数据，未变化的行情检查不会产生提交；
- 每个自然日第一次变化保存一份完整 `base`，之后只保存相对上一点的变化；
- 时区固定为 `Asia/Shanghai`，时间格式为 `2026-11-20T10:07:31+08:00`。

## 单日文件结构

```jsonc
{
  "schemaVersion": 1,
  "date": "2026-11-20",
  "timezone": "Asia/Shanghai",
  "catalogVersion": "v3.6",
  "itemCount": 267,
  "createdAt": "2026-11-20T10:07:31+08:00",
  "updatedAt": "2026-11-20T12:07:31+08:00",
  "base": {
    "at": "2026-11-20T10:07:31+08:00",
    "requested": ["s_mengjiangnan", "..."],
    "source": "seed",
    "coverage": { "s_mengjiangnan": [202, 13, 65] },
    "catalogPrices": { "fengwangjiang": 188.7 },
    "stoneCatalogPrices": { "6": 548.56 },
    "prices": { "s_mengjiangnan": { "fengwangjiang": 188.7 } },
    "stones": { "s_mengjiangnan": { "6": 548.56 } }
  },
  "samples": [
    {
      "at": "2026-11-20T12:07:31+08:00",
      "requested": ["s_mengjiangnan", "..."],
      "coverage": { "s_mengjiangnan": [201, 14, 64] },
      "prices": { "s_mengjiangnan": { "fengwangjiang": 190.5 } },
      "stones": { "s_mengjiangnan": { "6": 550.2 } }
    }
  ]
}
```

字段说明：

- `prices[区服ID][物品ID]`：该服该物品的 JX3BOX 拍卖价（金），只保存有效报价；
- `stones[区服ID][等级]`：五行石 1–8 级价格；
- `catalogPrices[物品ID]`：当日目录基准价（梦江南样本 / 示例价），用于补齐本服无报价的物品；
- `stoneCatalogPrices[等级]`：五行石基准价；
- `coverage[区服ID] = [有效报价数, 被过滤数, 无报价数]`；
- `source`：`update` 为自动更新，`seed` 为首次建立的历史基线；
- `samples[].prices` / `stones` / `catalogPrices` / `stoneCatalogPrices` 都是**增量**：数字表示新价，`null` 表示该物品/等级已无有效报价；
- 未出现在某次增量里的物品，价格沿用上一个快照点。

查询某时间点的完整价格时，从当天 `base` 开始，按顺序应用 `samples` 中 `at <= 目标时间` 的增量即可；`scripts/price-history.mjs` 已封装好。

## 查询与导出

```bash
# 列出已有的历史日期
node scripts/price-history.mjs list

# 某服在某个时间点的快照
node scripts/price-history.mjs as-of 2026-11-20T12:00 --server 梦江南

# 单个物品的价格变化
node scripts/price-history.mjs series --server 梦江南 --item 蜂王浆 --from 2026-11-20

# 导出变化点 CSV，供 Excel / Python 二次分析
node scripts/price-history.mjs export --server 梦江南 --from 2026-11-20 --out /tmp/mj.csv

# 用基准价补齐本服无报价的物品（与实际收益计算口径一致）
node scripts/price-history.mjs export --server 梦江南 --from 2026-11-20 --effective --out /tmp/mj-effective.csv
```

- `series` / `export` 输出变化点：范围内首个快照点给出全部当前值，之后只列变化；
- `--effective` 增加“价格来源”列：`本服报价` 或 `基准价`；
- 五行石用 `stone:<等级>` 表示，例如 `--item stone:6`；
- 时间默认按北京时间解释，只写日期时取当天 23:59:59。

## 维护

```bash
# 重建 index.json（手工增删过 days 文件时）
node scripts/price-history.mjs reindex

# 把指定日期之前的日内变化折叠为当天最后快照，控制仓库体积
node scripts/price-history.mjs compact --before 2026-06-01
```

`compact` 会丢弃旧日期日内的高频变化点，只保留当天最后一个完整快照；折叠后查询早于该快照的时间会返回无数据。需要保留高频明细时不要执行，原始文件仍可从 git 历史找回。

随站点一起发布在 `price-history/` 下，可直接读取 `index.json` 与 `days/YYYY-MM-DD.json`。
