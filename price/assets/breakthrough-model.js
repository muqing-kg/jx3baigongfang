/* 突破计算模型。Web / 小工具副本由 scripts/sync-breakthrough-model.mjs 同步。 */
function createBreakthrough(BT, catalog, getState) {
  'use strict';
  const QUOTE_KEYS = {"玄元星平衫":"7_112590","地脉玄元":"5_89566","蜂王浆":"5_30854","兽皮胶":"5_30851","七彩线":"5_89960","百染线":"5_10175","玄元星平鞋":"7_112572","玄元星平护腕":"7_112560","风语·衣·绣（气血）":"5_71208","猫眼石":"5_30852","珠贝母":"5_30853","宝石":"5_30828","绢带":"5_89165","棉线":"5_32000","挂件包·背部":"5_7165","百花布":"5_89956","挂件包·腰部":"5_7166","蜀染布":"5_89957","纺丝":"5_32001","蜀染布包":"8_53","百股线":"5_10173","锦缝春山囊":"8_36275","五色石":"5_89958","鸡血石":"5_30856","沉香木":"5_30855","隔音帐":"5_71422","青魄玉":"5_89298","硼砂":"5_30679","石灰":"5_32004","银鳞":"5_30847","玛瑙":"5_30846","银丝缎":"5_89959","百花线":"5_32003","紫檀":"5_30848","金线":"5_32002","玄元木声衫":"7_112589","辉石":"5_30850","玄元松绿衫":"7_112588","云芝":"5_30845","绝世上衣·【寒】":"5_31231","蜃楼珠":"5_31397","蜀锦绣·腕（身法）":"5_89433","蜀锦绣·腕（力道）":"5_89435","寻踪觅宝·护手":"5_31253","同袍营幡":"5_90033","黄花菜":"5_30844","黄蜡":"5_89166","璧·苍生":"5_89568","玄元烽火鞋":"7_112569","境华":"5_90338","玄元赤地鞋":"7_112568","绝世鞋子·【寒】":"5_31239","玄元赤地护腕":"7_112556","玄元烽火护腕":"7_112557","绝世护腕·【寒】":"5_31235","驾驾伪装":"5_90210","麻絮":"5_35718","滑石粉":"5_35719","羊皮":"5_30873","哼唧伪装":"5_90205","灯笼":"8_614","山水刺绣手绢":"5_2466","刺绣手绢":"5_3819","小香包":"5_3779","彩缕花绫包":"8_36148","棉布包":"8_19","河洛纹·鞋（跑速）":"5_89475","河洛纹·衣（御劲）":"5_89474","丹青染布画":"5_3820","百炼水煮鱼":"5_89321","鱼肉":"5_30827","酱料":"5_89970","今朝醉":"5_32014","胡椒粉":"5_31978","红辣椒":"5_31985","路菜":"5_76622","西市腔":"5_1831","精制面粉":"5_31973","人参":"5_30849","风语·老火骨汤":"5_71293","骨头":"5_30826","血":"5_30825","藤椒":"5_89171","料酒":"5_31974","菌菇":"5_31968","风语·三鲜汤":"5_71292","精肉":"5_30824","新鲜冬瓜":"5_31967","风语·鲜肉包子":"5_71281","碎肉":"5_30823","老姜":"5_31969","风语·水煮肉片":"5_71277","云中珍馐宴（通用）":"5_89315","竹叶青":"5_1829","馅料":"5_89969","调料":"5_31976","巴渝珍馐宴（通用）":"5_89303","卤料":"5_89971","露水":"5_30840","羊杂":"5_30875","蛋":"5_30829","鱼腥草":"5_30843","羊肉":"5_30874","紫苏":"5_30842","饺子馅":"5_5270","大葱":"5_31970","饺子皮":"5_5269","生粉":"5_31977","转神餐":"5_31013","甘草":"5_30830","佛跳墙":"5_31012","安营炊鼎":"5_90034","酥油":"5_89172","巴山夜雨宴（外攻）":"5_89304","炼狱水煮鱼":"5_24212","膘然心动":"5_26057","如意饺":"5_26231","云州刀削面":"5_89352","山城毛血旺":"5_89350","风语·红烧排骨":"5_71269","云芝竹沥羹":"5_89346","竹沥":"5_89167","老豆腐":"5_31984","开锅豆腐":"5_89348","风语·杂锦鱼球粥":"5_71285","截元丹":"5_31101","虫草":"5_30836","千里香":"5_30832","枸杞":"5_30833","葫芦":"5_31997","竹沥凝心饮":"5_89324","大黄":"5_30831","药丸":"5_89973","药囊":"5_31996","风语·中品万灵丹":"5_71241","风语·上品万灵丹":"5_71240","药罐":"5_31995","风语·中品大力丸":"5_71266","彼岸花":"5_30838","珊瑚":"5_30839","药料":"5_6646","云州固阵丹":"5_89333","五味子":"5_30835","药膏":"5_89974","药用黄丹":"5_6648","风语·中品静心丸":"5_71267","回神丹":"5_90029","药曲":"5_89168","药引":"5_89972","金针·影":"5_31100","竹沥清心露":"5_89322","芍药":"5_30837","踏波露":"5_90206","飞鱼丸":"5_31102","川贝":"5_30834","金针":"5_31998","定魂丹砂":"5_90035","巴山凝神丹":"5_89328","河洛生息丹":"5_89332","巴山凝神散":"5_89340","五气归元丹":"5_89325","风语·上品健体丸":"5_71258","银针":"5_31999","五气培元丸":"5_89327","苍生·巨灵磨石（仇恨）":"5_89378","镔铁锭":"5_89966","炼火石":"5_10176","火墨":"5_31991","苍生·絮泊磨石（疗伤）":"5_89377","铅锭":"5_89968","煤炭":"5_31993","苍生·坠宵磨石（攻击）":"5_89376","锡锭":"5_89965","木炭":"5_31992","苍生·瀑沙磨石（武伤）":"5_89375","黄铜锭":"5_89963","苍生·巨灵熔锭（仇恨）":"5_89370","风语·巨灵磨石（仇恨）":"5_71192","松脂":"5_89169","风语·兵·甲（仇恨）":"5_71188","菜籽油":"5_31994","玄元星平帽":"7_112584","密银锭":"5_89962","玄元星平护腰":"7_112566","玄元星平裤":"7_112578","龙血磨石":"5_31139","青铜锭":"5_89964","素银钥匙":"5_10027","熟铁锭":"5_89961","素银钥匙模":"5_10029","铁矿":"5_30677","铅锌矿":"5_30676","银矿":"5_30678","铜矿":"5_30674","锡矿":"5_30675","生铁锭":"5_89967","苍生·瀑沙熔锭（武伤）":"5_89367","青铜钥匙":"5_6246","青铜钥匙模":"5_6249","玄元烽火裤":"7_112575","玄元风鹤裤":"7_112573","绝世下装·【兹】":"5_31209","切玉骨":"5_32787","玄元松绿护腰":"7_112564","玄元风鹤护腰":"7_112561","绝世腰带·【兹】":"5_31211","寄青荷":"8_25762","荷叶":"5_30841","旦火油":"5_10172","皮革":"5_35708","银龙笼套":"8_17541","铁纹鞍具":"8_17538","玄元松绿帽":"7_112582","玄元木声帽":"7_112583","绝世头饰·【兹】":"5_31210","定营铁桩":"5_90032","熟矾":"5_89170","珠·苍生":"5_89567","玄武腰刀":"8_632","青龙腰刀":"8_634","麒麟腰刀":"8_636","同门饕餮鼎":"5_90353","飞高高":"5_90257","铜偶":"5_2578","鞭炮":"5_6072","龙凤呈祥":"5_6068","元宝灯":"5_6066","木板":"5_35712","木料":"5_35566","清漆":"5_35707","绳索":"5_35703","器物令":"5_38831","鱼胶":"5_35716","黏土":"5_35702","篾条":"5_35715","竹子":"5_35568","芦苇杆":"5_35567","油布":"5_35704","雕花":"5_35714","石材":"5_35701","卯榫":"5_35713","楔子":"5_35705","清漆药柜":"10_1778","简素椅":"10_948","归营旌":"5_89260","锻炉":"10_1779","残烛柜架":"10_1880","矩形回纹格":"10_2034","葵草席":"10_93","禅心悬旗":"10_1882","阎家样":"5_35717","铜雕踩球对狮·右":"10_2037","素髹桑木灯檠":"10_164","地下室·8米木质标准包":"5_52337","竹篾篱·套件":"5_40232","兖石地墁·套件":"5_35772","飞毛腿伪装":"5_90211","拼布自选包":"5_87917","铃兰·混彩":"10_1167","拼布72色全包":"5_87881","杂碎":"5_30682","金沙":"5_30681","青石":"5_30680"}; // generated
  const META = BT.meta || {};
  const CAP = Number(META.levelCap) || 50;
  const GATE_LEVELS = [30, 35, 40, 45];
  const SKILL_IDS = ['shennong', 'caijin', 'paoding', 'duanzao', 'fengren', 'zhiyao', 'pengren', 'zijiang'];
  const MODES = [{ key: 'low', label: '低收益比档' }, { key: 'mid', label: '中收益比档' }, { key: 'high', label: '高收益比档' }];
  const items = BT.items || [], recipes = BT.recipes || [];
  const byName = {}, byId = {}, indexByName = {}, producers = {};
  (catalog.items || []).forEach(function (i) { byName[i.name] = i; byId[i.id] = i; });
  items.forEach(function (i, idx) { indexByName[i.n] = idx; });
  recipes.forEach(function (r) { (r.o || []).forEach(function (o) { (producers[o[0]] = producers[o[0]] || []).push(r); }); });
  const num = function (v) { return Number(v) || 0; };
  const itemOf = function (idx) { return items[idx] || { n: '未知物品' }; };
  const skillMeta = function (id) { return (catalog.skills || []).find(function (s) { return s.id === id; }) || { id: id, name: id }; };
  const chanceOf = function (v) { return v == null ? 1 : Math.max(0, Math.min(1, num(v))); };
  const quantity = function (o, mode) { return (mode === 'low' ? o[1] : mode === 'high' ? o[2] : (o[1] + o[2]) / 2) * chanceOf(o[3]); };
  function priceOfIndex(idx, serverId) {
    serverId = serverId || getState().serverId;
    const canon = byName[itemOf(idx).n];
    const primary = catalog.serverPrices && catalog.serverPrices[serverId];
    const v = canon && primary && primary[canon.id];
    // 同名道具可能属于不同物品表；目录脚本使用的 key 必须与突破道具一致。
    if (v > 0 && QUOTE_KEYS[itemOf(idx).n] === itemOf(idx).k) return { v: v, src: 'catalog-jx3box', at: catalog.meta.priceUpdatedAt };
    const snap = (BT.prices[serverId] || [])[idx];
    if (snap > 0) return { v: snap, src: 'breakthrough-jx3box', at: META.priceUpdatedAt };
    return { v: null, src: 'missing', at: null };
  }
  function gatherPrice(id, serverId) {
    const it = byId[id];
    const idx = it && indexByName[it.name];
    if (idx != null) return priceOfIndex(idx, serverId);
    const p = catalog.serverPrices && catalog.serverPrices[serverId];
    return p && p[id] > 0 ? { v: p[id], src: 'catalog-jx3box' } : { v: null, src: 'missing' };
  }
  function costTable(serverId, basis, mode) {
    const memo = [];
    function cost(idx, stack) {
      if (memo[idx]) return memo[idx];
      const p = priceOfIndex(idx, serverId);
      const base = { v: p.v, market: p.v, src: p.src, missing: p.v == null, recipe: null };
      if (basis !== 'min' || stack.indexOf(idx) !== -1) return base;
      let best = base;
      (producers[idx] || []).forEach(function (r) {
        const qty = (r.o || []).reduce(function (s, o) { return s + (o[0] === idx ? quantity(o, mode) : 0); }, 0);
        if (!(qty > 0)) return;
        let v = 0, missing = false;
        (r.m || []).forEach(function (m) { const c = cost(m[0], stack.concat(idx)); if (c.missing) missing = true; else v += c.v * m[1]; });
        if (!missing && (best.missing || v / qty < best.v - 1e-9)) best = { v: v / qty, market: p.v, src: 'craft', recipe: r, missing: false };
      });
      memo[idx] = best;
      return best;
    }
    items.forEach(function (_, idx) { memo[idx] = cost(idx, []); });
    return memo;
  }
  function recipeEcon(r, serverId, table, taxRate, mode) {
    const mats = (r.m || []).map(function (m) { const c = table[m[0]]; return { idx: m[0], qty: m[1], unit: c.v, src: c.src, missing: c.missing, sub: c.missing ? null : c.v * m[1] }; });
    const outs = (r.o || []).map(function (o) { const p = priceOfIndex(o[0], serverId), qty = quantity(o, mode); return { idx: o[0], min: o[1], max: o[2], chance: chanceOf(o[3]), qty: qty, unit: p.v, missing: p.v == null && qty > 0, sub: p.v == null && qty > 0 ? null : (p.v || 0) * qty }; });
    const matCost = mats.some(function (m) { return m.missing; }) ? null : mats.reduce(function (s, m) { return s + m.sub; }, 0);
    const gross = outs.some(function (o) { return o.missing; }) ? null : outs.reduce(function (s, o) { return s + o.sub; }, 0);
    const netValue = gross == null ? null : gross * (1 - taxRate);
    const profit = matCost == null || netValue == null ? null : netValue - matCost;
    return { mats: mats, outs: outs, matCost: matCost, gross: gross, netValue: netValue, profit: profit, exp: num(r.x), energy: num(r.e), missing: profit == null, profitPerExp: profit == null || !(r.x > 0) ? null : profit / r.x };
  }
  const expModel = META.expModel || { base: 500, step: 25 };
  const observations = (expModel.observations || []).slice().sort(function (a, b) { return a.level - b.level; });
  if (expModel.method === 'piecewise-linear' && (observations.length < 2 || observations.some(function (p, i) { return !Number.isInteger(p.level) || p.level < 1 || p.level >= CAP || !Number.isFinite(p.exp) || p.exp <= 0 || (i > 0 && (p.level === observations[i - 1].level || p.exp < observations[i - 1].exp)); }))) throw new Error('Invalid experience observations');
  function experienceAt(level) {
    if (!Number.isInteger(level) || level < 1 || level >= CAP) return { need: null, source: 'unavailable', estimated: true };
    if (expModel.method !== 'piecewise-linear') return { need: Math.max(1, Math.round(num(expModel.base) + num(expModel.step) * (level - 1))), source: 'estimated', estimated: true };
    const observed = observations.find(function (p) { return p.level === level; });
    if (observed) return { need: observed.exp, source: 'observed', estimated: false };
    let upper = observations.findIndex(function (p) { return p.level > level; });
    const extrapolated = upper < 0 || upper === 0;
    if (upper < 0) upper = observations.length - 1;
    if (upper === 0) upper = 1;
    const a = observations[upper - 1], b = observations[upper];
    const estimate = a.exp + (b.exp - a.exp) * (level - a.level) / (b.level - a.level);
    const step = num(expModel.roundTo) || 1;
    return { need: Math.max(1, Math.round(estimate / step) * step), source: extrapolated ? 'extrapolated' : 'interpolated', estimated: true };
  }
  function expToNext(level) { return experienceAt(level).need; }
  function experienceRows() {
    let cumulative = 0;
    return Array.from({ length: CAP - 1 }, function (_, i) { const point = experienceAt(i + 1); cumulative += point.need; return { from: i + 1, to: i + 2, need: point.need, cumulative: cumulative, source: point.source, estimated: point.estimated }; });
  }
  function gateInfo(g, serverId, basis, table) {
    const entries = (g.r || []).map(function (m) {
      const p = priceOfIndex(m[0], serverId), c = table[m[0]];
      const useCraft = basis === 'min' && c.src === 'craft';
      // 突破材料缺少本服报价时，保留自制成本参考，但不把它当成完整任务报价。
      const unit = p.v == null ? null : useCraft ? c.v : p.v;
      return { idx: m[0], name: itemOf(m[0]).n, qty: m[1], unit: unit, market: p.v, craft: c.src === 'craft' ? c.v : null, src: useCraft ? c.src : p.src, recipe: c.recipe || (producers[m[0]] || [])[0] || null, sub: unit == null ? null : unit * m[1], missing: unit == null };
    });
    const missingItems = entries.filter(function (i) { return i.missing; });
    const knownCost = entries.reduce(function (s, i) { return s + (i.sub == null ? 0 : i.sub); }, 0);
    return { level: g.l, name: g.n, items: entries, missingItems: missingItems, missing: missingItems.length > 0, knownCost: knownCost, cost: missingItems.length ? null : knownCost, marketCost: entries.some(function (i) { return i.market == null; }) ? null : entries.reduce(function (s, i) { return s + i.market * i.qty; }, 0) };
  }
  function gatherOutputs(recipe, serverId) {
    const state = getState(), taxRate = Math.max(0, Math.min(1, num(state.settings && state.settings.taxRate)));
    return (recipe.outputs || []).map(function (o) {
      const p = gatherPrice(o.item, serverId || state.serverId), chance = chanceOf(o.chance);
      return { name: byId[o.item] ? byId[o.item].name : o.item, qty: o.qty, chance: chance, unit: p.v, missing: p.v == null && o.qty * chance > 0, sub: p.v == null && o.qty * chance > 0 ? null : (p.v || 0) * o.qty * chance * (1 - taxRate) };
    });
  }
  function aggregate(rows, gates) {
    const t = { exp: 0, energy: 0, crafts: 0, matCost: 0, outValue: 0, profit: 0, gateCost: 0, gateMarket: 0, knownGateCost: 0, missingLevels: 0, missingGates: 0, missingPriceLevels: 0 };
    let bandValue = 0, bandEnergy = 0;
    rows.forEach(function (r) {
      t.exp += r.need;
      if (!r.recipe) { t.missingLevels++; return; }
      t.energy += r.totalEnergy; t.crafts += r.count;
      if (r.band && r.band.mean != null) { bandValue += r.band.mean * r.totalEnergy; bandEnergy += r.totalEnergy; }
      if (r.profit == null) t.missingPriceLevels++;
      ['matCost', 'outValue', 'profit'].forEach(function (k) { t[k] = t[k] == null || r[k] == null ? null : t[k] + r[k]; });
    });
    gates.forEach(function (g) { t.knownGateCost += g.knownCost; if (g.missing) t.missingGates++; else t.gateCost += g.cost; });
    t.gateMarket = gates.some(function (g) { return g.marketCost == null; }) ? null : gates.reduce(function (s, g) { return s + g.marketCost; }, 0);
    if (t.missingLevels) ['energy', 'crafts', 'matCost', 'outValue', 'profit'].forEach(function (k) { t[k] = null; });
    if (t.missingGates) t.gateCost = null;
    t.total = t.profit == null || t.gateCost == null ? null : t.profit - t.gateCost;
    t.netCost = t.total == null ? null : -t.total;
    t.bandMean = !t.missingLevels && bandEnergy > 0 ? bandValue / bandEnergy : null;
    return t;
  }
  function profitBand(available, mode) {
    if (!available.length) return { key: mode, count: 0, mean: null, min: null, max: null, pool: [] };
    const ratios = available.map(function (c) { return c.e.profit / c.e.energy; });
    const min = Math.min.apply(null, ratios), max = Math.max.apply(null, ratios), width = (max - min) / 3;
    const slot = { low: 0, mid: 1, high: 2 }[mode];
    const lower = min + width * slot, upper = min + width * (slot + 1);
    const pool = available.filter(function (c) { const ratio = c.e.profit / c.e.energy; return width < 1e-9 || (ratio >= lower && (slot === 2 ? ratio <= max : ratio < upper)); });
    return { key: mode, min: lower, max: upper, count: pool.length, mean: pool.length ? pool.reduce(function (s, c) { return s + c.e.profit / c.e.energy; }, 0) / pool.length : null, pool: pool };
  }
  function analyze(skillId, strategy, mode) {
    mode = MODES.some(function (m) { return m.key === mode; }) ? mode : 'high';
    // 精力/次数策略只生成一条路线，产量统一使用区间中点。
    if (strategy !== 'gold') mode = 'mid';
    const state = getState(), serverId = state.serverId;
    const basis = state.settings && state.settings.basis || 'market';
    const taxRate = Math.max(0, Math.min(1, num(state.settings && state.settings.taxRate)));
    const meta = skillMeta(skillId), gather = meta.type === 'gather';
    // 档位表示金/精力的数值区间，不表示产量；所有策略统一用产量中点。
    const table = costTable(serverId, basis, 'mid');
    const pool = gather ? (catalog.recipes || []).filter(function (r) { return r.kind === 'gather' && r.skillId === skillId; }) : recipes.filter(function (r) { return r.s === skillId; }).sort(function (a, b) { return a.l - b.l || String(a.n).localeCompare(String(b.n), 'zh-CN'); });
    const candidates = pool.map(function (r) {
      let e;
      if (gather) {
        const outs = gatherOutputs(r, serverId), missing = outs.some(function (o) { return o.missing; });
        const value = missing ? null : outs.reduce(function (s, o) { return s + o.sub; }, 0);
        e = { exp: num(META.gatherExp) || 80, energy: num(r.energy), matCost: 0, netValue: value, profit: value, missing: missing };
        e.profitPerExp = value == null ? null : value / e.exp;
      } else e = recipeEcon(r, serverId, table, taxRate, 'mid');
      return { r: r, e: e };
    });
    const levels = experienceRows().map(function (xp) {
      let pick = null;
      const available = candidates.filter(function (c) { return (gather ? c.r.level : c.r.l) <= xp.from && c.e.exp > 0 && c.e.energy > 0 && (strategy !== 'gold' || !c.e.missing); });
      const band = strategy === 'gold' ? profitBand(available, mode) : null;
      (band ? band.pool : available).forEach(function (c) {
        function score(e) { const count = Math.ceil(xp.need / e.exp); if (strategy === 'effort') return count; if (strategy === 'energy') return count * e.energy; return -count * e.profit; }
        const tied = pick && Math.abs(score(c.e) - score(pick.e)) <= 1e-9;
        const tieBetter = pick && (strategy === 'gold' ? c.e.energy / c.e.exp < pick.e.energy / pick.e.exp : strategy === 'energy' ? Math.ceil(xp.need / c.e.exp) < Math.ceil(xp.need / pick.e.exp) : Math.ceil(xp.need / c.e.exp) * c.e.energy < Math.ceil(xp.need / pick.e.exp) * pick.e.energy);
        if (!pick || score(c.e) < score(pick.e) - 1e-9 || (tied && tieBetter)) pick = c;
      });
      const r = pick && pick.r, e = pick && pick.e, count = e ? Math.ceil(xp.need / e.exp) : null;
      return { kind: 'level', from: xp.from, to: xp.to, need: xp.need, name: r ? (r.n || r.name) : band && available.length ? '本级该收益比档无样本' : '无符合等级的可用路线', level: r ? (gather ? r.level : r.l) : null, recipe: r, econ: e, band: band ? { key: mode, min: band.min, max: band.max, mean: band.mean, count: band.count } : null, exp: e ? e.exp : null, energy: e ? e.energy : null, count: count, matCost: e && e.matCost != null ? e.matCost * count : null, outValue: e && e.netValue != null ? e.netValue * count : null, profit: e && e.profit != null ? e.profit * count : null, totalEnergy: e ? e.energy * count : null };
    });
    const gates = (BT.gates[skillId] || []).filter(function (g) { return GATE_LEVELS.indexOf(g.l) !== -1; }).map(function (g) { return gateInfo(g, serverId, basis, table); });
    const bands = [];
    levels.forEach(function (r) {
      const prev = bands[bands.length - 1];
      if (prev && prev.recipe === r.recipe && JSON.stringify(prev.band) === JSON.stringify(r.band) && GATE_LEVELS.indexOf(prev.to) === -1) {
        prev.to = r.to; prev.need += r.need;
        ['count', 'matCost', 'outValue', 'profit', 'totalEnergy'].forEach(function (k) { prev[k] = prev[k] == null || r[k] == null ? null : prev[k] + r[k]; });
      } else bands.push(Object.assign({}, r));
    });
    const routes = [];
    bands.forEach(function (r) { routes.push(r); const gate = gates.find(function (g) { return g.level === r.to; }); if (gate) routes.push(Object.assign({ kind: 'gate' }, gate)); });
    routes.push({ kind: 'max', level: CAP, name: '50 级 · 满级（无独立突破任务）' });
    const totals = aggregate(levels, gates);
    const phases = [{ from: 1, to: 30 }, { from: 30, to: CAP }].map(function (p) { return Object.assign({}, p, aggregate(levels.filter(function (r) { return r.from >= p.from && r.from < p.to; }), gates.filter(function (g) { return p.from === 1 ? g.level === 30 : g.level > 30; }))); });
    return { kind: gather ? 'gather' : 'craft', skillId: skillId, strategy: strategy, mode: mode, meta: meta, levels: levels, experience: experienceRows(), routes: routes, gates: gates, phases: phases, totals: totals, enough: strategy === 'gold' ? totals.total != null : !totals.missingLevels };
  }
  function summary(strategy, mode) {
    return SKILL_IDS.map(function (id) { const r = analyze(id, strategy, mode); return Object.assign({ skillId: id, name: r.meta.name, color: r.meta.color, type: r.meta.type, enough: r.enough }, r.totals); }).sort(function (a, b) { const key = strategy === 'energy' ? 'energy' : strategy === 'effort' ? 'crafts' : 'netCost'; if (a[key] == null) return b[key] == null ? 0 : 1; if (b[key] == null) return -1; return a[key] - b[key]; });
  }
  function itemsText(r, limit) {
    if (!r) return '';
    if (r.kind === 'gather') return (r.outputs || []).slice(0, limit || 2).map(function (o) { return (byId[o.item] ? byId[o.item].name : o.item) + '×' + o.qty + (chanceOf(o.chance) < 1 ? '（' + Math.round(chanceOf(o.chance) * 100) + '%）' : ''); }).join(' + ');
    return (r.o || []).slice(0, limit || 2).map(function (o) { return itemOf(o[0]).n + '×' + (o[1] === o[2] ? o[1] : o[1] + '~' + o[2]) + (chanceOf(o[3]) < 1 ? '（' + Math.round(chanceOf(o[3]) * 100) + '%）' : ''); }).join(' + ');
  }
  function matsText(r, limit) { return r ? (r.m || []).slice(0, limit || 3).map(function (m) { return itemOf(m[0]).n + '×' + m[1]; }).join(' · ') : ''; }
  return { META: META, CAP: CAP, GATE_LEVELS: GATE_LEVELS, SKILL_IDS: SKILL_IDS, MODES: MODES, analyze: analyze, summary: summary, expToNext: expToNext, experienceRows: experienceRows, itemOf: itemOf, priceOfIndex: priceOfIndex, gatherOutputs: gatherOutputs, itemsText: itemsText, matsText: matsText, formatRange: function (from, to) { return from + '→' + to + ' 级'; } };
}
if (typeof module !== 'undefined' && module.exports) module.exports = createBreakthrough;
else window.createJX3Breakthrough = createBreakthrough;
