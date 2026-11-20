#!/usr/bin/env node
/**
 * 剑网三物价助手 · 技艺「突破升级」数据构建
 *
 * 数据来源（2026-11 苍生铸世赛季）：
 *   1) 配方/经验/精力：JX3BOX 技艺接口 https://node.jx3box.com/manufactures
 *   2) 物品名称：JX3BOX 物品接口 https://node.jx3box.com/api/node/item/{type}_{id}
 *   3) 各服价格：JX3BOX 拍卖 https://next2.jx3box.com/api/auction/（铜/10000 = 金）
 *   4) 30/35/40/45 级「晋秩」突破任务材料：
 *      JX3BOX 攻略《【苍生铸世】鱼历小药宴席改动 & 生活技艺升级攻略》
 *      https://www.jx3box.com/bps/109793
 *
 * 用法：
 *   node scripts/build-breakthrough-data.mjs
 *   node scripts/build-breakthrough-data.mjs --skip-prices   # 只更新配方，沿用旧价格
 *
 * 输出：miniapp/src/shared/breakthrough.json
 * 结构（紧凑数组，控制小程序包体）：
 *   items:   [{ k: '5_89956', n: '百花布', q: 3 }]
 *   recipes: [{ i, s, n, l, x, e, t: 1?, m: [[i,qty]], o: [[i,min,max,chance]] }]
 *   gates:   { skillId: [{ l: 30, n: '晋秩·学徒', r: [[i,qty]] }] }
 *   prices:  { serverId: [price|null, ...] }   // 与 items 下标对齐
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'miniapp/src/shared/breakthrough.json');
const WEB_OUT = path.join(ROOT, 'assets/breakthrough-data.js');
const MINI_OUT = path.join(ROOT, 'minitool/assets/breakthrough-data.js');
const WEB_CORE = path.join(ROOT, 'assets/breakthrough.js');
const MINI_CORE = path.join(ROOT, 'minitool/assets/breakthrough.js');
const CATALOG = path.join(ROOT, 'miniapp/src/shared/catalog.json');
const args = process.argv.slice(2);
const SKIP_PRICES = args.includes('--skip-prices');
const PRICES_ONLY = args.includes('--prices-only');
const MIN_SAMPLE = 5;   // 拍卖样本过少的价格剔除，避免极端挂单价
const MAX_RATIO = 4;    // 单服价格偏离全服中位数 4 倍以上剔除

const TYPES = {
  cooking: 'pengren',
  tailoring: 'fengren',
  medicine: 'zhiyao',
  founding: 'duanzao',
  furniture: 'zijiang'
};
const TYPE_KEYS = Object.keys(TYPES);
const MAX_ID = 2000;
const ID_BATCH = 20;

// 用户观测点与插值/外推规则集中维护，重新获取配方不会覆盖经验校准。
const EXP_MODEL = JSON.parse(fs.readFileSync(path.join(ROOT, 'miniapp/src/shared/experience-model.json'), 'utf8'));
// 采集单次经验估算：制造配方经验恒为精力的 2 倍，采集按同一比例取 40 精力 = 80 经验。
const GATHER_EXP = 80;

const GATES = {
  caijin: [
    { l: 30, n: '晋秩·学徒', r: [['百花布', 8], ['熟铁锭', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['河洛纹·腕（身法）', 1], ['河洛纹·腕（元气）', 1], ['云冈石·裤（身法）', 1]] },
    { l: 40, n: '晋秩·名师', r: [['河洛纹·腕（身法）', 1], ['河洛纹·腕（力道）', 1], ['云冈石·裤（力道）', 1], ['云冈石·裤（根骨）', 1]] },
    { l: 45, n: '晋秩·宗师', r: [['河洛纹·腕（根骨）', 1], ['云冈石·裤（仇恨）', 1], ['塞外暖羊宴（治疗）', 1]] }
  ],
  shennong: [
    { l: 30, n: '晋秩·学徒', r: [['药引', 8], ['木板', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['巴山凝神散', 8], ['竹沥凝心饮', 1], ['绿竹墙·套件', 1]] },
    { l: 40, n: '晋秩·名师', r: [['青石锭', 1], ['巴山凝神散', 10], ['红荣素·臻', 1], ['鸦青素·臻', 1]] },
    { l: 45, n: '晋秩·宗师', r: [['镀金锭', 1], ['地下室·8米木质标准包', 1], ['塞外暖羊宴（治疗）', 3]] }
  ],
  paoding: [
    { l: 30, n: '晋秩·学徒', r: [['馅料', 8], ['酱料', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['雁门猎风宴（外攻）', 2]] },
    { l: 40, n: '晋秩·名师', r: [['塞外暖羊宴（治疗）', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 45, n: '晋秩·宗师', r: [['云中珍馐宴（通用）', 1], ['雁门猎风宴（外攻）', 1], ['塞外暖羊宴（治疗）', 1]] }
  ],
  duanzao: [
    { l: 30, n: '晋秩·学徒', r: [['百花布', 8], ['蜀染布', 8], ['木板', 8], ['卯榫', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['河洛纹·腕（身法）', 1], ['河洛纹·腕（元气）', 1], ['绿竹墙·套件', 1], ['兖石地墁·套件', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 40, n: '晋秩·名师', r: [['河洛纹·腕（身法）', 1], ['河洛纹·腕（力道）', 1], ['红荣素·臻', 2], ['鸦青素·臻', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 45, n: '晋秩·宗师', r: [['河洛纹·腕（根骨）', 1], ['河洛纹·腕（仇恨）', 1], ['地下室·8米木质标准包', 1], ['红荣素·臻', 1], ['塞外暖羊宴（治疗）', 2]] }
  ],
  zhiyao: [
    { l: 30, n: '晋秩·学徒', r: [['木板', 8], ['卯榫', 8], ['馅料', 8], ['酱料', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['绿竹墙·套件', 1], ['兖石地墁·套件', 1], ['雁门猎风宴（外攻）', 1], ['胡笳月夜宴（内攻）', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 40, n: '晋秩·名师', r: [['红荣素·臻', 1], ['鸦青素·臻', 1], ['塞外暖羊宴（治疗）', 2], ['云中珍馐宴（通用）', 1]] },
    { l: 45, n: '晋秩·宗师', r: [['地下室·8米木质标准包', 1], ['红荣素·臻', 1], ['胡笳月夜宴（内攻）', 1], ['雁门猎风宴（外攻）', 1], ['塞外暖羊宴（治疗）', 2]] }
  ],
  pengren: [
    { l: 30, n: '晋秩·学徒', r: [['药引', 8], ['药丸', 8], ['木板', 8], ['卯榫', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['巴山凝神散', 2], ['竹沥凝心饮', 1], ['绿竹墙·套件', 1], ['兖石地墁·套件', 1], ['云中珍馐宴（通用）', 2]] },
    { l: 40, n: '晋秩·名师', r: [['青石锭', 1], ['巴山凝神散', 1], ['红荣素·臻', 1], ['鸦青素·臻', 1], ['云中珍馐宴（通用）', 3]] },
    { l: 45, n: '晋秩·宗师', r: [['青石锭', 1], ['镀金锭', 1], ['地下室·8米木质标准包', 1], ['红荣素·臻', 1], ['塞外暖羊宴（治疗）', 4]] }
  ],
  fengren: [
    { l: 30, n: '晋秩·学徒', r: [['熟铁锭', 8], ['密银锭', 8], ['木板', 8], ['卯榫', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['云冈石·裤（身法）', 1], ['云冈石·裤（元气）', 1], ['绿竹墙·套件', 1], ['兖石地墁·套件', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 40, n: '晋秩·名师', r: [['云冈石·裤（力道）', 1], ['云冈石·裤（根骨）', 1], ['红荣素·臻', 1], ['鸦青素·臻', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 45, n: '晋秩·宗师', r: [['云冈石·裤（仇恨）', 1], ['云冈石·裤（破防）', 1], ['地下室·8米木质标准包', 1], ['红荣素·臻', 1], ['塞外暖羊宴（治疗）', 2]] }
  ],
  zijiang: [
    { l: 30, n: '晋秩·学徒', r: [['熟铁锭', 8], ['密银锭', 8], ['百花布', 8], ['蜀染布', 8]] },
    { l: 35, n: '晋秩·巧匠', r: [['云冈石·裤（身法）', 1], ['云冈石·裤（元气）', 1], ['河洛纹·腕（身法）', 1], ['河洛纹·腕（元气）', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 40, n: '晋秩·名师', r: [['云冈石·裤（力道）', 1], ['云冈石·裤（根骨）', 1], ['河洛纹·腕（身法）', 1], ['河洛纹·腕（力道）', 1], ['云中珍馐宴（通用）', 1]] },
    { l: 45, n: '晋秩·宗师', r: [['云冈石·裤（仇恨）', 1], ['云冈石·裤（破防）', 1], ['河洛纹·腕（根骨）', 1], ['河洛纹·腕（仇恨）', 1], ['塞外暖羊宴（治疗）', 1]] }
  ]
};

const HINTS = {
  caijin: '采金靠采集升级，建议与其他制造技艺同步：需要矿材时顺路采，突破材料基本来自缝纫/铸造/烹饪。',
  shennong: '神农靠采集草药升级，红荣素·臻、鸦青素·臻既可采到也可交易行购买，建议与制药/烹饪一起做。',
  paoding: '庖丁靠庖丁动物尸体升级，突破材料多为烹饪宴席，适合与烹饪同步。',
  duanzao: '刷经验首选：飞爪（100经验，麻絮/滑石粉商店可买）、寄青荷（专精，400经验，荷叶便宜）、碎空石（专精，200经验）。',
  zhiyao: '刷经验首选 120 经验的特殊药品（飞鱼丸、截元丹、逍遥散、风身丸、忘情水等），鉴影散（专精）80 经验。',
  pengren: '盘龙饺/戏凤饺约 3 金 74 经验，性价比高；鱼肉多可做 100 经验的挂件类。',
  fengren: '绫罗皮包约 15 金 60 经验，材料简单；高等级产物可顺带做突破材料。',
  zijiang: '梓匠配方多、材料便宜，基本做啥都行；木板/卯榫是各技艺突破的硬通货，可顺路囤。'
};

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function getJson(url, options) {
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, Object.assign({ headers: { 'User-Agent': 'jx3-breakthrough-builder/1.0' } }, options || {}));
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return await res.json();
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(300 * (attempt + 1));
    }
  }
}

async function fetchRecipes() {
  const recipes = [];
  for (const type of TYPE_KEYS) {
    const byId = new Map();
    let cursor = 1;
    const workers = Array.from({ length: 8 }, async () => {
      while (true) {
        const start = cursor;
        cursor += ID_BATCH;
        if (start > MAX_ID) return;
        const ids = [];
        for (let i = start; i < start + ID_BATCH && i <= MAX_ID; i++) ids.push(i);
        const url = `https://node.jx3box.com/manufactures?type=${type}&ids=${ids.join(',')}&client=std&per=50`;
        const arr = await getJson(url);
        if (!Array.isArray(arr)) continue;
        for (const r of arr) if (r && r.ID != null) byId.set(r.ID, r);
      }
    });
    await Promise.all(workers);
    let current = 0;
    for (const r of byId.values()) {
      if (!(r.RequireLevel >= 1 && r.RequireLevel <= 50)) continue;
      if (!(r.Exp > 0)) continue;
      const mats = [];
      for (let i = 1; i <= 8; i++) {
        const key = `${r['RequireItemType' + i]}_${r['RequireItemIndex' + i]}`;
        const qty = Number(r['RequireItemCount' + i]) || 0;
        if (r['RequireItemIndex' + i] && qty > 0) mats.push([key, qty]);
      }
      const outs = [];
      for (let i = 1; i <= 8; i++) {
        const type2 = r['CreateItemType' + i];
        const idx = r['CreateItemIndex' + i];
        const min = Number(r['CreateItemMin' + i]) || 0;
        if (!idx || !min) continue;
        const max = Number(r['CreateItemMax' + i]) || min;
        const prob = Number(r['CreateItemProbability' + i]);
        outs.push([`${type2}_${idx}`, min, max, prob > 0 ? Math.min(1, prob / 1048576) : 1]);
      }
      if (!mats.length || !outs.length) continue;
      recipes.push({
        type, skillId: TYPES[type], id: r.ID, name: r.Name,
        level: r.RequireLevel, exp: Number(r.Exp), energy: Number(r.CostVigor) || Number(r.Exp) / 2,
        expert: r.NeedExpertise ? 1 : 0, quality: r.Quality,
        mats, outs
      });
      current++;
    }
    console.log(`[配方] ${type} 当前赛季 ${current} 条`);
  }
  return recipes;
}

async function fetchNames(keys) {
  const names = {};
  let cursor = 0;
  const workers = Array.from({ length: 20 }, async () => {
    while (true) {
      const i = cursor++;
      if (i >= keys.length) return;
      const key = keys[i];
      try {
        const j = await getJson(`https://node.jx3box.com/api/node/item/${key}?client=std`);
        const it = (j.data || {}).item || {};
        if (it.Name) names[key] = { n: it.Name, q: Number(it.Quality) || 1 };
      } catch {
        names[key] = { n: key, q: 1 };
      }
    }
  });
  await Promise.all(workers);
  return names;
}

async function fetchPrices(keys, servers) {
  const prices = {};
  for (const server of servers) {
    const bucket = {};
    for (let i = 0; i < keys.length; i += 35) {
      const batch = keys.slice(i, i + 35);
      try {
        const arr = await getJson('https://next2.jx3box.com/api/auction/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': 'jx3-price-updater/2.0' },
          body: JSON.stringify({ aggregate_type: 'hourly', item_ids: batch, server: server.name })
        });
        if (Array.isArray(arr)) {
          for (const x of arr) {
            if (!x || !x.item_id || !(x.price > 0)) continue;
            if (Number(x.sample) < MIN_SAMPLE) continue;
            bucket[x.item_id] = Math.round(x.price / 100) / 100;
          }
        }
      } catch (err) {
        console.warn(`[warn] ${server.name} 价格批次失败：${err.message}`);
      }
    }
    prices[server.id] = bucket;
    console.log(`[价格] ${server.name} ${Object.keys(bucket).length}/${keys.length}`);
  }
  return prices;
}

function median(values) {
  const arr = values.filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (!arr.length) return null;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

/* 价格清洗：
   1) 抓取阶段已剔除样本 < MIN_SAMPLE 的挂单；
   2) 只有 1~2 个服务器有报价的物品视为流动性不足，剔除（避免单服孤价）；
   3) 单服价格偏离全服中位数 MAX_RATIO 倍以上剔除；有目录基准价的再与基准价对齐。 */
function buildPriceArray(keys, quotes, servers, catalog, names) {
  const baseByName = {};
  (catalog.items || []).forEach((i) => { if (i.base > 0) baseByName[i.name] = i.base; });
  const out = {};
  const medians = keys.map((key) => {
    const vals = servers.map((s) => (quotes[s.id] && quotes[s.id][key]) || 0).filter((v) => v > 0);
    return { med: median(vals), n: vals.length };
  });
  for (const s of servers) {
    const bucket = quotes[s.id] || {};
    out[s.id] = keys.map((key, idx) => {
      const v = bucket[key];
      if (!(v > 0)) return null;
      const stat = medians[idx];
      if (v === 10000) return null; // 拍卖接口对无成交物品返回 10000 金哨兵值
      if (stat.n < 3 && !(names && baseByName[names[idx]] > 0)) return null;
      if (stat.med && (v > stat.med * MAX_RATIO || v < stat.med / MAX_RATIO)) return null;
      const base = names ? baseByName[names[idx]] : 0;
      if (base > 0 && v > base * MAX_RATIO) return null;
      return Math.round(v * 100) / 100;
    });
  }
  return out;
}

/* 同步 Web / 小红书小工具：数据脚本 + 共用内核 */
function writeWebBundles(data) {
  const header = '/* 剑网三物价助手 · 突破升级数据（由 scripts/build-breakthrough-data.mjs 生成，勿手改） */\n';
  fs.writeFileSync(WEB_OUT, header + 'window.JX3Breakthrough = ' + JSON.stringify(data) + ';\n');
  const mini = JSON.parse(JSON.stringify(data));
  // 小工具离线容器不允许外链：来源只保留名称
  if (mini.meta && Array.isArray(mini.meta.sources)) {
    mini.meta.sources = mini.meta.sources.map((s) => Object.assign({}, s, { url: '' }));
  }
  fs.writeFileSync(MINI_OUT, header + 'window.JX3Breakthrough = ' + JSON.stringify(mini) + ';\n');
  if (fs.existsSync(WEB_CORE)) fs.copyFileSync(WEB_CORE, MINI_CORE);
  console.log('[同步] assets/breakthrough-data.js / minitool/assets/breakthrough-data.js / breakthrough.js');
}

function main() {
  return (async () => {
    const catalog = JSON.parse(fs.readFileSync(CATALOG, 'utf8'));
    const servers = catalog.servers;

    if (PRICES_ONLY) {
      const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
      const keys = prev.items.map((it) => it.k);
      const names = prev.items.map((it) => it.n);
      const quotes = await fetchPrices(keys, servers);
      const priceArr = buildPriceArray(keys, quotes, servers, catalog, names);
      prev.prices = priceArr;
      prev.meta.priceUpdatedAt = new Date().toISOString();
      fs.writeFileSync(OUT, JSON.stringify(prev));
      writeWebBundles(prev);
      console.log('[完成] 仅更新价格 →', OUT, (fs.statSync(OUT).size / 1024).toFixed(0) + ' KB');
      return;
    }

    const recipes = await fetchRecipes();
    // 11-19 更新把部分配方等级下调至 1，接口未同步，用目录中的已核验等级覆盖
    const catLevel = {};
    (catalog.recipes || []).forEach((r) => { if (r.kind === 'craft') catLevel[r.name] = Math.min(catLevel[r.name] == null ? 999 : catLevel[r.name], r.level); });
    recipes.forEach((r) => { if (catLevel[r.name] && catLevel[r.name] < r.level) r.level = catLevel[r.name]; });
    const gateDefs = Object.entries(GATES).flatMap(([skillId, gates]) => gates.map((g) => Object.assign({ skillId }, g)));
    const gateItems = new Set();
    gateDefs.forEach((g) => g.r.forEach(([name]) => gateItems.add(name)));

    const keys = new Set();
    recipes.forEach((r) => {
      r.mats.forEach(([k]) => keys.add(k));
      r.outs.forEach(([k]) => keys.add(k));
    });

    // 先取名字，再把突破材料名解析成 key
    const nameMap = await fetchNames([...keys]);
    const byName = {};
    Object.entries(nameMap).forEach(([k, v]) => { byName[v.n] = k; });
    const unresolved = [...gateItems].filter((n) => !byName[n]);
    if (unresolved.length) {
      console.warn('[warn] 突破材料未能在物品库匹配：', unresolved.join('、'));
    }
    unresolved.forEach((n) => gateItems.delete(n));
    gateItems.forEach((n) => keys.add(byName[n]));

    const itemKeys = [...keys];
    const index = new Map(itemKeys.map((k, i) => [k, i]));
    const items = itemKeys.map((k) => ({ k, n: nameMap[k] ? nameMap[k].n : k, q: nameMap[k] ? nameMap[k].q : 1 }));

    const outRecipes = recipes.map((r) => {
      const row = {
        i: r.id, s: r.skillId, n: r.name, l: r.level, x: r.exp, e: r.energy,
        m: r.mats.map(([k, q]) => [index.get(k), q]),
        o: r.outs.map(([k, min, max, p]) => [index.get(k), min, max, p])
      };
      if (r.expert) row.t = 1;
      return row;
    }).filter((r) => r.m.every(([i]) => i != null) && r.o.every(([i]) => i != null));

    const gates = {};
    for (const g of gateDefs) {
      const row = g.r.filter(([n]) => byName[n]).map(([n, q]) => [index.get(byName[n]), q]);
      if (!row.length) continue;
      gates[g.skillId] = gates[g.skillId] || [];
      gates[g.skillId].push({ l: g.l, n: g.n, r: row });
    }

    let prices = {};
    if (!SKIP_PRICES) {
      prices = await fetchPrices(itemKeys, servers);
    } else if (fs.existsSync(OUT)) {
      try {
        const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
        prices = prev.prices || {};
      } catch { prices = {}; }
    }

    const priceArr = buildPriceArray(itemKeys, prices, servers, catalog, itemKeys.map((k) => (nameMap[k] ? nameMap[k].n : k)));

    const data = {
      meta: {
        game: '剑网3',
        expansion: '苍生铸世',
        levelCap: 50,
        version: 'v1.0',
        updatedAt: new Date().toISOString().slice(0, 10),
        expModel: EXP_MODEL,
        gatherExp: GATHER_EXP,
        priceServers: servers.length,
        priceUpdatedAt: new Date().toISOString(),
        disclaimer: '突破任务材料与等级门槛来自 JX3BOX 攻略与成就库（30/35/40/45 级晋秩，无独立 50 级任务）；配方等级/经验/精力来自 JX3BOX 技艺接口。逐级经验使用5个用户观测点，点间插值、31级起末段外推，推算值取整到10，暂按八技艺共用门槛；其余等级及采集单次经验仍待核实，可能影响次数、路线和收益。任务奖励材料不可提交；未核实的任务脚本奖励未计入收益。',
        sources: [
          { label: 'JX3BOX · 生活技艺升级攻略（2026-11-12）', url: 'https://www.jx3box.com/bps/109793' },
          { label: 'JX3BOX · 技艺配方接口', url: 'https://node.jx3box.com/manufactures' },
          { label: 'JX3BOX · 成就「完成40级突破」', url: 'https://www.jx3box.com/cj/5/49' },
          { label: 'JX3BOX · 拍卖行情', url: 'https://next2.jx3box.com/api/auction/' }
        ],
        hints: HINTS
      },
      items,
      recipes: outRecipes,
      gates,
      prices: priceArr
    };
    fs.writeFileSync(OUT, JSON.stringify(data));
    writeWebBundles(data);
    const kb = (fs.statSync(OUT).size / 1024).toFixed(0);
    console.log(`[完成] ${outRecipes.length} 条配方 / ${items.length} 件物品 / ${Object.values(gates).reduce((n, g) => n + g.length, 0)} 个突破门槛 → ${OUT} (${kb} KB)`);
  })().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

main();
