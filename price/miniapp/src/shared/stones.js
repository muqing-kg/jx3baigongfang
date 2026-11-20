/* =========================================================================
   精力做什么 · 五行石计算内核（无 DOM / 无平台 API）
   微信小程序、小红书小程序、H5 共用
   ========================================================================= */
import catalog from './catalog.json';
import { round } from './format';

const DATA = catalog;
export const STONE_META = DATA.stoneMeta || {};
export const STONE_LEVELS = (DATA.stones || []).slice().sort(function (a, b) { return a.level - b.level; });

const BY_LEVEL = {};
STONE_LEVELS.forEach(function (l) { BY_LEVEL[l.level] = l; });
const DEFAULT_RECIPES = DATA.stoneRecipes || [];

function number(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function clamp01(v) {
  return Math.max(0, Math.min(1, number(v)));
}

export function stoneLevelInfo(level) {
  return BY_LEVEL[level] || { level: level, name: '五行石（' + level + '级）', color: '#94A3B8', base: 0 };
}

export function stoneLevelName(level) {
  return level + '级';
}

export function stoneTaxRate(state) {
  const t = state && state.settings ? Number(state.settings.taxRate) : NaN;
  return Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : (Number(STONE_META.taxRate) || 0.05);
}

export function stonePrice(state, serverId, level) {
  serverId = serverId || (state && state.serverId);
  const bucket = (state && state.stonePrices && state.stonePrices[serverId]) || {};
  const stored = bucket[String(level)];
  if (stored && Number.isFinite(Number(stored.v))) {
    const v = Number(stored.v);
    return { v: v, user: true, seed: false, missing: !(v > 0) };
  }
  const marketBucket = (state && state.stoneMarketPrices && state.stoneMarketPrices[serverId]) || {};
  const market = marketBucket[String(level)];
  if (market != null && Number.isFinite(Number(market))) {
    const mt = state && state.marketMeta ? Date.parse(state.marketMeta.stonePriceUpdatedAt || state.marketMeta.priceUpdatedAt || '') : NaN;
    return {
      v: Number(market), user: false, seed: false, market: true, missing: false,
      t: Number.isFinite(mt) ? mt : 0
    };
  }
  const seedBucket = (DATA.stonePrices || {})[serverId] || {};
  const seed = Number(seedBucket[String(level)]);
  if (seed > 0) return { v: seed, user: false, seed: true, missing: false };
  const base = Number((BY_LEVEL[level] || {}).base) || 0;
  return { v: base, user: false, seed: true, missing: !(base > 0) };
}

export function stoneNetPrice(state, serverId, level) {
  return round(stonePrice(state, serverId, level).v * (1 - stoneTaxRate(state)), 4);
}

export function stonePriceUpdatedAt(state) {
  const market = state && state.marketMeta
    ? Date.parse(state.marketMeta.stonePriceUpdatedAt || state.marketMeta.priceUpdatedAt || '')
    : NaN;
  if (Number.isFinite(market)) return market;
  const stone = Date.parse((DATA.meta && DATA.meta.stonePriceUpdatedAt) || '');
  if (Number.isFinite(stone)) return stone;
  const all = Date.parse((DATA.meta && DATA.meta.priceUpdatedAt) || '');
  return Number.isFinite(all) ? all : 0;
}

export function sanitizeStoneRecipe(input) {
  const r = input || {};
  const target = Math.max(2, Math.min(8, Math.round(number(r.target) || 6)));
  const primary = Math.max(1, Math.min(8, Math.round(number(r.primary) || target)));
  const inputs = (Array.isArray(r.inputs) ? r.inputs : []).filter(function (x) {
    return x && number(x.level) >= 1 && number(x.level) <= 8 && number(x.qty) > 0;
  }).map(function (x) {
    return { level: Math.round(number(x.level)), qty: Math.max(1, Math.round(number(x.qty))) };
  });
  const outcomes = (Array.isArray(r.outcomes) ? r.outcomes : []).filter(function (x) {
    return x && number(x.level) >= 1 && number(x.level) <= 8;
  }).map(function (x) {
    return { level: Math.round(number(x.level)), chance: clamp01(x.chance) };
  });

  return {
    id: r.id || null,
    name: String(r.name || '').trim() || '未命名公式',
    mode: ['fast', 'optimal', 'jackpot'].indexOf(r.mode) >= 0 ? r.mode : 'optimal',
    target: target,
    primary: primary,
    inputs: inputs.length ? inputs : [{ level: 1, qty: 1 }],
    outcomes: outcomes.length ? outcomes : [{ level: target, chance: 1 }],
    fee: Math.max(0, number(r.fee)),
    energy: Math.max(0, Math.round(number(r.energy))),
    verified: !!r.verified,
    source: r.source || '自定义公式',
    note: r.note || '',
    custom: !!r.custom
  };
}

export function isDefaultStoneRecipe(id) {
  return DEFAULT_RECIPES.some(function (r) { return r.id === id; });
}

export function stoneRecipes(state) {
  const edits = (state && state.stoneRecipeEdits) || {};
  const customs = (state && state.stoneCustomRecipes) || [];
  const overrides = (state && state.stoneChances) || {};

  const base = DEFAULT_RECIPES.map(function (r) {
    const e = edits[r.id];
    if (!e || !Array.isArray(e.inputs) || !Array.isArray(e.outcomes)) return r;
    return Object.assign({}, r, e, { id: r.id, custom: false, edited: true });
  }).concat(customs.filter(function (r) {
    return r && r.id && r.name && Array.isArray(r.inputs) && Array.isArray(r.outcomes);
  }).map(function (r) {
    return Object.assign({}, r, { custom: true });
  }));

  return base.map(function (r) {
    const o = overrides[r.id];
    if (!o || !Array.isArray(r.outcomes)) return r;
    return Object.assign({}, r, {
      outcomes: r.outcomes.map(function (x) {
        const v = o[String(x.level)];
        return v == null ? x : Object.assign({}, x, { chance: clamp01(v) });
      })
    });
  });
}

export function stoneRecipe(state, id) {
  return stoneRecipes(state).find(function (r) { return r.id === id; }) || null;
}

function breakEven(state, serverId, r, cost, targetNet) {
  const net = function (level) { return stoneNetPrice(state, serverId, level); };
  if (r.target === r.primary) {
    let otherValue = 0;
    r.outcomes.forEach(function (o) {
      if (o.level !== r.target) otherValue += o.chance * net(o.level);
    });
    const p = targetNet > 0 ? (cost - otherValue) / targetNet : null;
    return { p: p, kind: 'success', valid: p != null && p >= 0 && p <= 1 };
  }
  let otherChance = 0;
  let otherValue = 0;
  r.outcomes.forEach(function (o) {
    if (o.level === r.target || o.level === r.primary) return;
    otherChance += o.chance;
    otherValue += o.chance * net(o.level);
  });
  const primaryNet = net(r.primary);
  const denom = targetNet - primaryNet;
  if (!(denom > 0)) return { p: null, kind: 'jackpot', valid: false, otherChance: otherChance };
  const p = (cost - (1 - otherChance) * primaryNet - otherValue) / denom;
  return { p: p, kind: 'jackpot', valid: p != null && p >= 0 && p <= 1, otherChance: otherChance };
}

export function evalStoneRecipe(state, serverId, r, plan) {
  serverId = serverId || state.serverId;
  let inputCost = 0;
  let inputEnergy = 0;
  let missing = 0;

  r.inputs.forEach(function (inp) {
    const node = (plan && plan[inp.level]) ? plan[inp.level] : {
      cost: stonePrice(state, serverId, inp.level).v, energy: 0, source: 'market'
    };
    inputCost += number(node.cost) * inp.qty;
    inputEnergy += number(node.energy) * inp.qty;
    if (!(number(node.cost) > 0)) missing += 1;
  });

  const cost = inputCost + r.fee;
  let targetChance = 0;
  let primaryChance = 0;
  let outcomeValue = 0;
  let byproductValue = 0;

  r.outcomes.forEach(function (o) {
    const np = stoneNetPrice(state, serverId, o.level);
    outcomeValue += o.chance * np;
    if (o.level === r.target) targetChance += o.chance;
    if (o.level === r.primary) primaryChance += o.chance;
    if (o.level !== r.target) byproductValue += o.chance * np;
    if (!(np > 0)) missing += 1;
  });

  const targetNet = stoneNetPrice(state, serverId, r.target);
  const totalEnergy = inputEnergy + r.energy;
  const costPerTarget = targetChance > 0 ? (cost - byproductValue) / targetChance : Infinity;
  const energyPerTarget = targetChance > 0 ? totalEnergy / targetChance : Infinity;
  const profitPerTarget = targetChance > 0 && Number.isFinite(costPerTarget) ? targetNet - costPerTarget : null;
  const perEnergyTarget = profitPerTarget != null && energyPerTarget > 0 ? profitPerTarget / energyPerTarget : null;
  const profitPerAttempt = outcomeValue - cost;
  const perEnergyAttempt = totalEnergy > 0 ? profitPerAttempt / totalEnergy : null;

  return {
    recipe: r, target: r.target, primary: r.primary,
    inputs: r.inputs, fee: r.fee, energy: r.energy,
    inputCost: inputCost, inputEnergy: inputEnergy, totalEnergy: totalEnergy, cost: cost,
    targetChance: targetChance, primaryChance: primaryChance,
    outcomeValue: outcomeValue, byproductValue: byproductValue,
    targetNet: targetNet, primaryNet: stoneNetPrice(state, serverId, r.primary),
    costPerTarget: costPerTarget, energyPerTarget: energyPerTarget,
    profitPerTarget: profitPerTarget, perEnergyTarget: perEnergyTarget,
    profitPerAttempt: profitPerAttempt, perEnergyAttempt: perEnergyAttempt,
    margin: outcomeValue > 0 ? profitPerAttempt / outcomeValue : null,
    roi: cost > 0 ? profitPerAttempt / cost : null,
    missing: missing > 0,
    breakEven: breakEven(state, serverId, r, cost, targetNet)
  };
}

export function stoneMarketPlan(state, serverId) {
  const plan = {};
  STONE_LEVELS.forEach(function (l) {
    plan[l.level] = {
      level: l.level, cost: stonePrice(state, serverId, l.level).v, energy: 0,
      source: 'market', recipeId: null
    };
  });
  return plan;
}

export function buildStonePlan(state, serverId, mode) {
  const all = stoneRecipes(state);
  const plan = { 1: { level: 1, cost: stonePrice(state, serverId, 1).v, energy: 0, source: 'market', recipeId: null } };
  const allowMarket = mode.indexOf('buy') === 0;

  for (let level = 2; level <= 8; level += 1) {
    const market = { level: level, cost: stonePrice(state, serverId, level).v, energy: 0, source: 'market', recipeId: null };
    const candidates = allowMarket ? [market] : [];

    all.filter(function (r) { return r.target === level; }).forEach(function (r) {
      const ev = evalStoneRecipe(state, serverId, r, plan);
      if (ev.targetChance > 0 && Number.isFinite(ev.costPerTarget) && ev.costPerTarget > 0) {
        candidates.push({
          level: level, cost: ev.costPerTarget, energy: ev.energyPerTarget,
          source: 'craft', recipeId: r.id, ev: ev
        });
      }
    });

    let chosen = market;
    const craft = candidates.filter(function (c) { return c.source === 'craft'; });
    if (craft.length) {
      if (mode === 'craft-gold' || mode === 'buy-gold') {
        chosen = candidates.reduce(function (a, b) { return a.cost <= b.cost ? a : b; });
      } else if (mode === 'craft-energy' || mode === 'buy-energy') {
        chosen = candidates.reduce(function (a, b) { return a.energy <= b.energy ? a : b; });
      } else if (mode === 'craft-profit' || mode === 'buy-profit') {
        const pool = craft.filter(function (c) {
          return c.ev && c.ev.perEnergyTarget != null && c.ev.profitPerTarget > 0;
        });
        chosen = pool.length
          ? pool.reduce(function (a, b) { return a.ev.perEnergyTarget >= b.ev.perEnergyTarget ? a : b; })
          : craft.reduce(function (a, b) { return a.cost <= b.cost ? a : b; });
      } else {
        chosen = candidates.reduce(function (a, b) { return a.cost <= b.cost ? a : b; });
      }
    }
    plan[level] = chosen;
  }
  return plan;
}

function rowOf(ev, method, planMode) {
  return Object.assign({}, ev, {
    method: method,
    planMode: planMode,
    key: ev.recipe.id + '|' + planMode
  });
}

export function stoneRows(state) {
  const serverId = state.serverId;
  const all = stoneRecipes(state);
  const craftGold = buildStonePlan(state, serverId, 'craft-gold');
  const craftEnergy = buildStonePlan(state, serverId, 'craft-energy');
  const craftProfit = buildStonePlan(state, serverId, 'craft-profit');
  const plans = [
    { key: 'gold', label: '最低金币', plan: craftGold },
    { key: 'energy', label: '最低精力', plan: craftEnergy },
    { key: 'profit', label: '最高精力收益', plan: craftProfit }
  ];
  const out = [];
  const seen = {};

  function pushUnique(ev, method, planMode) {
    if (seen[ev.recipe.id + '|' + planMode]) return;
    if (out.some(function (x) {
      return x.recipe.id === ev.recipe.id &&
        Math.abs(x.costPerTarget - ev.costPerTarget) < 1e-6 &&
        Math.abs(x.energyPerTarget - ev.energyPerTarget) < 1e-6;
    })) return;
    seen[ev.recipe.id + '|' + planMode] = true;
    out.push(rowOf(ev, method, planMode));
  }

  [3, 4, 5, 6].forEach(function (level) {
    all.filter(function (r) { return r.target === level && r.mode === 'fast'; }).forEach(function (r) {
      pushUnique(evalStoneRecipe(state, serverId, r, craftGold), '快速合成', 'fast');
    });
    plans.forEach(function (p) {
      const node = p.plan[level];
      if (!node || node.source !== 'craft') return;
      const r = all.find(function (x) { return x.id === node.recipeId; });
      if (!r) return;
      pushUnique(evalStoneRecipe(state, serverId, r, p.plan), p.label, p.key);
    });
    all.filter(function (r) { return r.target === level && r.mode !== 'fast'; }).forEach(function (r) {
      if (out.some(function (x) { return x.recipe.id === r.id; })) return;
      pushUnique(evalStoneRecipe(state, serverId, r, craftGold), '备选', 'gold');
    });
  });

  const market = stoneMarketPlan(state, serverId);
  all.filter(function (r) { return r.target >= 7; }).forEach(function (r) {
    pushUnique(evalStoneRecipe(state, serverId, r, market), '赌跳级', 'market');
  });

  return out.sort(function (a, b) {
    if (a.target !== b.target) return a.target - b.target;
    const order = { '快速合成': 0, '最低金币': 1, '最低精力': 2, '最高精力收益': 3, '赌跳级': 4, '备选': 5 };
    const oa = order[a.method] == null ? 9 : order[a.method];
    const ob = order[b.method] == null ? 9 : order[b.method];
    if (oa !== ob) return oa - ob;
    return (b.perEnergyTarget == null ? -1e9 : b.perEnergyTarget) - (a.perEnergyTarget == null ? -1e9 : a.perEnergyTarget);
  });
}

function pickBest(all, level) {
  const pool = all.filter(function (r) {
    return r.target === level && r.targetChance > 0 && r.perEnergyTarget != null && Number.isFinite(r.perEnergyTarget);
  });
  if (!pool.length) return null;
  return pool.reduce(function (a, b) { return b.perEnergyTarget > a.perEnergyTarget ? b : a; });
}

export function stoneSummary(state) {
  const all = stoneRows(state);
  const best = {};
  [3, 4, 5, 6].forEach(function (l) { best[l] = pickBest(all, l); });
  const bestOverall = [3, 4, 5, 6].map(function (l) { return best[l]; })
    .filter(Boolean)
    .sort(function (a, b) { return b.perEnergyTarget - a.perEnergyTarget; })[0] || null;

  return {
    all: all,
    best: best,
    bestOverall: bestOverall,
    be7: all.find(function (r) { return r.recipe.id === 'jack_7'; }) || null,
    be8: all.find(function (r) { return r.recipe.id === 'jack_8'; }) || null,
    be8alt: all.find(function (r) { return r.recipe.id === 'jack_8_alt'; }) || null,
    be8from4: all.find(function (r) { return r.recipe.id === 'jack_8_from4'; }) || null,
    fast5: all.find(function (r) { return r.recipe.id === 'fast_5'; }) || null,
    fast6: all.find(function (r) { return r.recipe.id === 'fast_6'; }) || null,
    taxRate: stoneTaxRate(state)
  };
}
