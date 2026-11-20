// Excel 365：数据 → 获取数据 → 其他源 → 空查询 → 高级编辑器，粘贴本段并保存。
// 查询结果直接是 39 列的物价表；加载到「物价」A1 即可。
let
    源 = Json.Document(Web.Contents("https://cherishxie.github.io/JX3-AH-Calculator/prices.json")),
    表 = Table.FromRecords(源)
in
    表
