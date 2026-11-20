/* =========================================================================
   精力做什么 · 跨端计算内核（无 DOM / 无平台 API）
   微信小程序、小红书小程序、H5 共用
   ========================================================================= */
import catalog from './catalog.json';
import { num, round } from './format';

export const DATA = catalog;
const CANON = {};
(DATA.items || []).forEach(function (i) { CANON[i.id] = i; });
export const SEED_TS = Date.parse(catalog.meta && catalog.meta.priceUpdatedAt) || Date.parse('2026-11-18T09:00:00+08:00');
export const SCHEMA = 4;

export function clone(v) {
  return v == null ? v : JSON.parse(JSON.stringify(v));
}

export function findItem(state, id) {
  return (state.items || []).find(function (i) { return i.id === id; }) || null;
}
export function findRecipe(state, id) {
  return (state.recipes || []).find(function (r) { return r.id === id; }) || null;
}
export function findServer(state, id) {
  return (state.servers || []).find(function (s) { return s.id === id; }) || null;
}
export function skillOf(id) {
  return DATA.skills.find(function (s) { return s.id === id; }) || { id: id, name: id, type: 'craft', color: '#1D6FE0', desc: '' };
}
export function tierOf(id) {
  return DATA.tiers.find(function (t) { return t.id === Number(id); }) || DATA.tiers[0];
}

export function seedState() {
  return {
    schema: SCHEMA,
    seedVersion: DATA.meta.seedVersion,
    serverId: DATA.servers[0].id,
    servers: clone(DATA.servers),
    items: clone(DATA.items),
    recipes: clone(DATA.recipes),
    prices: {},
    stonePrices: {},
    stoneChances: {},
    stoneRecipeEdits: {},
    stoneCustomRecipes: [],
    marketPrices: {},
    stoneMarketPrices: {},
    marketMeta: null,
    settings: {
      energyBudget: 3000,
      gatherEnergy: 40,
      craftEnergy: 100,
      basis: 'market',
      taxRate: 0.05,
      taxRateVersion: 1
    },
    seq: { item: 1, recipe: 1 }
  };
}

export function normalize(saved) {
  const base = seedState();
  const state = Object.assign(base, saved || {});
  state.settings = Object.assign({}, base.settings, state.settings || {});
  if (!saved || !saved.settings || saved.settings.themeVersion !== 1) {
    if (!(saved && saved.settings && saved.settings.themePicked)) state.settings.theme = 'light';
    state.settings.themeVersion = 1;
  }
  if (!saved || !saved.settings || saved.settings.taxRateVersion !== 1) {
    state.settings.taxRate = 0.05;
    state.settings.taxRateVersion = 1;
  }
  state.seq = Object.assign({}, base.seq, state.seq || {});
  state.prices = state.prices && typeof state.prices === 'object' ? state.prices : {};
  state.marketPrices = state.marketPrices && typeof state.marketPrices === 'object' ? state.marketPrices : {};
  state.stoneMarketPrices = state.stoneMarketPrices && typeof state.stoneMarketPrices === 'object' ? state.stoneMarketPrices : {};
  state.marketMeta = state.marketMeta && typeof state.marketMeta === 'object' ? state.marketMeta : null;
  state.stonePrices = state.stonePrices && typeof state.stonePrices === 'object' ? state.stonePrices : {};
  state.stoneChances = state.stoneChances && typeof state.stoneChances === 'object' ? state.stoneChances : {};
  state.stoneRecipeEdits = state.stoneRecipeEdits && typeof state.stoneRecipeEdits === 'object' ? state.stoneRecipeEdits : {};
  state.stoneCustomRecipes = Array.isArray(state.stoneCustomRecipes) ? state.stoneCustomRecipes : [];
  if (!Array.isArray(state.servers) || !state.servers.length) state.servers = clone(DATA.servers);
  if (!findServer(state, state.serverId)) state.serverId = state.servers[0].id;

  if (saved && (saved.schema !== SCHEMA || saved.seedVersion !== DATA.meta.seedVersion)) {
    const customItems = (saved.items || []).filter(function (i) { return i && i.custom; });
    const customRecipes = (saved.recipes || []).filter(function (r) { return r && r.custom; });
    state.items = clone(DATA.items).concat(clone(customItems));
    state.recipes = clone(DATA.recipes).concat(clone(customRecipes));
    state.schema = SCHEMA;
    state.seedVersion = DATA.meta.seedVersion;
    if (state.settings && state.settings.gatherEnergy === 20) state.settings.gatherEnergy = 40;
  }

  state.items = (state.items || []).filter(function (i) { return i && i.id && i.name; });
  state.recipes = (state.recipes || []).filter(function (r) {
    return r && r.id && r.name && Array.isArray(r.outputs) && r.outputs.length;
  }).map(function (r) {
    return Object.assign({}, r, {
      kind: r.kind === 'gather' ? 'gather' : 'craft',
      level: num(r.level) || 1,
      tier: num(r.tier) || 1,
      energy: num(r.energy) || 1,
      fee: num(r.fee),
      outputs: r.outputs.filter(function (o) { return o && o.item && num(o.qty) > 0; }),
      materials: (r.materials || []).filter(function (m) { return m && m.item && num(m.qty) > 0; })
    });
  }).filter(function (r) { return r.outputs.length > 0; });

  return state;
}

export function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seedPrice(serverId, item) {
  if (!item) return 0;
  const canonical = (!item.custom && CANON[item.id]) ? CANON[item.id] : item;
  if (!(canonical.base > 0)) return 0;
  const bucket = DATA.serverPrices && DATA.serverPrices[serverId];
  const actual = bucket && Number(bucket[canonical.id]);
  if (actual > 0) return round(actual, 2);
  const known = DATA.servers.some(function (s) { return s.id === serverId; });
  if (serverId === 's_mengjiangnan' || known) return round(canonical.base, 2);
  const h = hash(serverId + '|' + canonical.id);
  const jitter = 0.96 + (h % 800) / 10000;
  const skillFactor = 0.96 + (hash(serverId + '|' + canonical.skillId) % 700) / 10000;
  return round(canonical.base * jitter * skillFactor, 2);
}

export function priceOf(state, itemId, serverId) {
  serverId = serverId || state.serverId;
  const item = findItem(state, itemId);
  const bucket = state.prices[serverId] || {};
  const stored = bucket[itemId];
  if (stored && Number.isFinite(Number(stored.v))) {
    return { v: Number(stored.v), t: stored.t || SEED_TS, user: true, seed: false, missing: false };
  }
  const marketBucket = state.marketPrices && state.marketPrices[serverId];
  const market = marketBucket && marketBucket[itemId];
  if (market != null && Number.isFinite(Number(market))) {
    const mt = state.marketMeta ? Date.parse(state.marketMeta.priceUpdatedAt || '') : NaN;
    return {
      v: Number(market), t: Number.isFinite(mt) ? mt : SEED_TS,
      user: false, seed: false, market: true, quote: true, missing: false
    };
  }
  const v = seedPrice(serverId, item);
  const q = DATA.serverPrices && DATA.serverPrices[serverId] && DATA.serverPrices[serverId][item.id];
  return { v: v, t: SEED_TS, user: false, seed: true, quote: q != null, missing: !(v > 0) };
}

export function unitCost(state, itemId, opts, stack) {
  const serverId = opts.serverId || state.serverId;
  const market = priceOf(state, itemId, serverId);
  const base = { value: market.v, market: market.v, source: 'market', recipeId: null, missing: !(market.v > 0), seed: market.seed };
  if (opts.basis !== 'min') return base;
  stack = stack || [];
  if (stack.indexOf(itemId) !== -1) return base;
  const producers = state.recipes.filter(function (r) {
    return r.kind === 'craft' && r.outputs.some(function (o) { return o.item === itemId; });
  });
  if (!producers.length) return base;
  const nextStack = stack.concat(itemId);
  let best = null;
  producers.forEach(function (r) {
    const c = calcRecipe(state, r, opts, nextStack);
    if (c.missingMaterials) return;
    const outQty = r.outputs.reduce(function (sum, o) { return sum + (o.item === itemId ? o.qty : 0); }, 0);
    if (!(outQty > 0)) return;
    const unit = c.totalCost / outQty;
    if (!best || unit < best.value) {
      best = { value: unit, market: market.v, source: 'craft', recipeId: r.id, missing: false, seed: false };
    }
  });
  if (best && (market.v <= 0 || best.value < market.v - 1e-9)) return best;
  return base;
}

export function calcRecipe(state, recipe, opts, stack) {
  const serverId = opts.serverId || state.serverId;
  const materials = [];
  let materialCost = 0;
  let missingMaterials = 0;
  if (recipe.kind !== 'gather') {
    (recipe.materials || []).forEach(function (m) {
      const item = findItem(state, m.item);
      const uc = unitCost(state, m.item, opts, stack);
      const sub = uc.value * m.qty;
      materialCost += sub;
      if (uc.missing) missingMaterials++;
      materials.push({
        itemId: m.item, name: item ? item.name : m.item, qty: m.qty,
        unit: uc.value, sub: sub, market: uc.market,
        source: uc.source, recipeId: uc.recipeId, missing: uc.missing, seed: uc.seed
      });
    });
  }
  const fee = num(recipe.fee);
  const totalCost = materialCost + fee;
  const outputs = [];
  let outputValueGross = 0;
  let missingOutputs = 0;
  (recipe.outputs || []).forEach(function (o) {
    const item = findItem(state, o.item);
    const p = priceOf(state, o.item, serverId);
    const chance = o.chance == null ? 1 : Math.max(0, Math.min(1, Number(o.chance)));
    const expectedQty = o.qty * chance;
    const sub = p.v * expectedQty;
    outputValueGross += sub;
    if (p.missing) missingOutputs++;
    outputs.push({ itemId: o.item, name: item ? item.name : o.item, qty: o.qty, chance: chance, expectedQty: expectedQty, qtyMin: o.qtyMin, qtyMax: o.qtyMax, unit: p.v, sub: sub, missing: p.missing, seed: p.seed });
  });
  const energy = num(recipe.energy);
  const rawTaxRate = Number(state.settings && state.settings.taxRate);
  const taxRate = Number.isFinite(rawTaxRate) ? Math.max(0, Math.min(1, rawTaxRate)) : 0.05;
  const tax = outputValueGross * taxRate;
  const outputValue = outputValueGross - tax;
  const profit = outputValue - totalCost;
  const perEnergy = energy > 0 ? profit / energy : null;
  return {
    materials: materials, materialCost: materialCost, missingMaterials: missingMaterials,
    fee: fee, totalCost: totalCost, outputs: outputs, outputValueGross: outputValueGross,
    taxRate: taxRate, tax: tax, outputValue: outputValue,
    missingOutputs: missingOutputs, missing: missingMaterials + missingOutputs > 0,
    profit: profit, energy: energy, perEnergy: perEnergy,
    margin: totalCost > 0 && outputValue > 0 ? profit / outputValue : null,
    roi: totalCost > 0 ? profit / totalCost : null
  };
}

export function rowsOf(state, opts) {
  opts = opts || {};
  const serverId = opts.serverId || state.serverId;
  const basis = opts.basis || 'market';
  return state.recipes.map(function (recipe) {
    const calc = calcRecipe(state, recipe, { serverId: serverId, basis: basis });
    const skill = skillOf(recipe.skillId);
    const tier = tierOf(recipe.tier);
    const outputNames = recipe.outputs.map(function (o) {
      const item = findItem(state, o.item);
      const q = o.qtyMin != null && o.qtyMax != null && o.qtyMax > o.qtyMin
        ? o.qtyMin + '~' + o.qtyMax
        : (o.qty > 1 ? String(o.qty) : '');
      const chance = o.chance == null ? 1 : Number(o.chance);
      const c = chance < 0.999 ? '（' + (chance * 100).toFixed(chance < 0.1 ? 1 : 0) + '%）' : '';
      return (item ? item.name : o.item) + (q ? ' ×' + q : '') + c;
    }).join(' + ');
    return {
      recipe: recipe, calc: calc, skill: skill, tier: tier,
      outputNames: outputNames, type: recipe.kind === 'gather' ? 'gather' : 'craft'
    };
  });
}

export function statsOf(state, serverId) {
  serverId = serverId || state.serverId;
  let user = 0, market = 0, seed = 0, missing = 0;
  state.items.forEach(function (i) {
    const p = priceOf(state, i.id, serverId);
    if (p.user) user++;
    else if (p.market) market++;
    else if (p.v > 0) seed++;
    else missing++;
  });
  return {
    total: state.items.length, user: user, market: market, seed: seed, missing: missing,
    calibrated: state.items.length ? user / state.items.length : 0
  };
}

export function median(values) {
  const arr = values.filter(function (v) { return Number.isFinite(v); }).sort(function (a, b) { return a - b; });
  if (!arr.length) return null;
  const mid = Math.floor(arr.length / 2);
  return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
}

export function avg(values) {
  const arr = values.filter(function (v) { return Number.isFinite(v); });
  if (!arr.length) return null;
  return arr.reduce(function (s, v) { return s + v; }, 0) / arr.length;
}

export function simulate(rows, budget) {
  const pool = rows.filter(function (r) {
    return !r.calc.missing && r.calc.perEnergy > 0 && r.calc.energy > 0;
  }).sort(function (a, b) { return b.calc.perEnergy - a.calc.perEnergy; });
  let remaining = Math.max(0, num(budget));
  let profit = 0, used = 0;
  const allocations = [];
  pool.forEach(function (r) {
    if (remaining < r.calc.energy) return;
    const n = Math.floor(remaining / r.calc.energy);
    if (n <= 0) return;
    const e = n * r.calc.energy;
    const p = n * r.calc.profit;
    allocations.push({ row: r, count: n, energy: e, profit: p });
    remaining -= e;
    profit += p;
    used += e;
  });
  return { budget: Math.max(0, num(budget)), profit: profit, used: used, remaining: remaining, allocations: allocations };
}

export function filterRows(rows, p) {
  p = p || {};
  const type = p.type || 'all';
  const skillId = p.skillId || '';
  const tierId = p.tier || '';
  const q = (p.q || '').trim();
  return rows.filter(function (r) {
    if (type !== 'all' && r.type !== type) return false;
    if (skillId && r.recipe.skillId !== skillId) return false;
    if (tierId && String(r.recipe.tier) !== String(tierId)) return false;
    if (p.onlyProfit && !(r.calc.profit > 0 && !r.calc.missing)) return false;
    if (p.complete && r.calc.missing) return false;
    if (q) {
      const hay = r.recipe.name + ' ' + r.outputNames + ' ' + r.skill.name;
      if (hay.toLowerCase().indexOf(q.toLowerCase()) === -1) return false;
    }
    return true;
  });
}

export function sortRows(rows, sort, dir) {
  const key = sort || 'perEnergy';
  const mul = dir === 'asc' ? 1 : -1;
  return rows.slice().sort(function (a, b) {
    let av, bv;
    if (key === 'name') { av = a.recipe.name; bv = b.recipe.name; }
    else if (key === 'cost') { av = a.calc.totalCost; bv = b.calc.totalCost; }
    else if (key === 'output') { av = a.calc.outputValue; bv = b.calc.outputValue; }
    else if (key === 'profit') { av = a.calc.profit; bv = b.calc.profit; }
    else { av = a.calc.missing ? null : a.calc.perEnergy; bv = b.calc.missing ? null : b.calc.perEnergy; }
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'string') return av.localeCompare(bv, 'zh-CN') * mul;
    return (av - bv) * mul;
  });
}

export function serverSpreads(state) {
  const out = [];
  state.items.forEach(function (it) {
    const ps = state.servers.map(function (s) { return { server: s, price: priceOf(state, it.id, s.id).v }; })
      .filter(function (x) { return x.price > 0; });
    if (ps.length < 2) return;
    ps.sort(function (a, b) { return a.price - b.price; });
    const min = ps[0], max = ps[ps.length - 1];
    if (min.price <= 0) return;
    const ratio = (max.price - min.price) / min.price;
    if (ratio >= 0.12) out.push({ item: it, min: min, max: max, ratio: ratio });
  });
  return out.sort(function (a, b) { return b.ratio - a.ratio; });
}

export function spreadBySkill(state, skillId) {
  const rows = rowsOf(state, {});
  return rows.filter(function (r) { return r.recipe.skillId === skillId; });
}
