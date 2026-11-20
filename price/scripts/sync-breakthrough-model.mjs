import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const modelPath = new URL('miniapp/src/shared/breakthrough-model.js', root);
const catalog = JSON.parse(fs.readFileSync(new URL('miniapp/src/shared/catalog.json', root)));
const mapping = JSON.parse(fs.readFileSync(new URL('scripts/jx3-item-map.json', root)));
const keys = Object.fromEntries(catalog.items.filter(i => mapping[i.name]).map(i => [i.name, mapping[i.name]]));
const source = fs.readFileSync(modelPath, 'utf8').replace(/^  const QUOTE_KEYS = .*; \/\/ generated$/m, '  const QUOTE_KEYS = ' + JSON.stringify(keys) + '; // generated');
fs.writeFileSync(modelPath, source);
for (const path of ['assets/breakthrough-model.js']) fs.writeFileSync(new URL(path, root), source);

// 只更新经验元数据，保留配方、物品索引、各服报价及报价时间。
const expModel = JSON.parse(fs.readFileSync(new URL('miniapp/src/shared/experience-model.json', root)));
const disclaimer = '突破任务为30/35/40/45级晋秩，无独立50级任务。经验门槛使用用户提供的5个观测点，点间插值、31级起末段线性外推，推算值取整到10；暂按八技艺共用门槛模拟，其余等级及技艺间差异尚未核实。采集单次经验仍为估算，任务脚本奖励未计入收益。';
for (const file of ['miniapp/src/shared/breakthrough.json', 'assets/breakthrough-data.js']) {
  const url = new URL(file, root);
  const existing = fs.readFileSync(url, 'utf8');
  const marker = 'window.JX3Breakthrough = ';
  const offset = existing.indexOf(marker);
  const data = JSON.parse(offset < 0 ? existing : existing.slice(offset + marker.length).trim().replace(/;$/, ''));
  data.meta.expModel = expModel;
  data.meta.disclaimer = disclaimer;
  fs.writeFileSync(url, (offset < 0 ? '' : existing.slice(0, offset) + marker) + JSON.stringify(data) + (offset < 0 ? '\n' : ';\n'));
}
