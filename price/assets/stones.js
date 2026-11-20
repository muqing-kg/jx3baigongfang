/* =========================================================================
   物价助手 · 五行石合成引擎
   - 1-8 级五行石价格（按服）
   - 快速合成 / 最优合成（金币、精力两条口径）
   - 7/8 级赌跳级与爆率盈亏线
   - 所有公式可编辑，售价统一扣交易税
   ========================================================================= */
(function () {
  'use strict';

  const C = window.JX3Core;
  const DATA = window.JX3Data;
  const U = C.U;
  const Store = C.Store;

  const META = DATA.stoneMeta || {};
  const LEVELS = (DATA.stones || []).slice().sort(function (a, b) { return a.level - b.level; });
  const BY_LEVEL = {};
  LEVELS.forEach(function (l) { BY_LEVEL[l.level] = l; });

  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }
  function num(v) { return Number.isFinite(Number(v)) ? Number(v) : 0; }
  function clamp01(v) { return Math.max(0, Math.min(1, num(v))); }
  function levelInfo(level) {
    return BY_LEVEL[level] || { level: level, name: '五行石（' + level + '级）', color: '#94A3B8', base: 0 };
  }
  function levelName(level) { return level + '级'; }

  /* ------------------------------------------------------------------ */
  /* 状态                                                               */
  /* ------------------------------------------------------------------ */
  let ensured = false;

  function ensure() {
    if (!Store.state) return;
    const s = Store.state;
    let changed = false;
    if (!s.stonePrices || typeof s.stonePrices !== 'object') { s.stonePrices = {}; changed = true; }
    const defaults = DATA.stoneRecipes || [];
    if (!Array.isArray(s.stoneRecipes) || !s.stoneRecipes.length) {
      s.stoneRecipes = clone(defaults);
      s.stoneFormulaVersion = META.version || 'stone-v1';
      changed = true;
    } else {
      const byId = {};
      s.stoneRecipes.forEach(function (r) { if (r && r.id) byId[r.id] = r; });
      const merged = defaults.map(function (d) {
        return byId[d.id] ? Object.assign(clone(d), byId[d.id]) : clone(d);
      });
      s.stoneRecipes.forEach(function (r) {
        if (r && r.custom && !defaults.some(function (d) { return d.id === r.id; })) merged.push(r);
      });
      if (merged.length !== s.stoneRecipes.length || merged.some(function (r, i) { return r.id !== s.stoneRecipes[i].id; })) changed = true;
      s.stoneRecipes = merged;
      if (s.stoneFormulaVersion !== META.version) { s.stoneFormulaVersion = META.version || 'stone-v1'; changed = true; }
    }
    if (changed) Store.save();
    ensured = true;
  }

  function taxRate() {
    const st = Store.state && Store.state.settings;
    const t = st ? Number(st.taxRate) : NaN;
    return Number.isFinite(t) ? Math.max(0, Math.min(1, t)) : 0.05;
  }

  function priceUpdatedAt() {
    const stamp = DATA.meta && DATA.meta.stonePriceUpdatedAt;
    const parsed = Date.parse(stamp || '');
    if (Number.isFinite(parsed)) return parsed;
    return C.seedTimestamp ? C.seedTimestamp() : (DATA.meta && Date.parse(DATA.meta.priceUpdatedAt)) || 0;
  }

  /* ------------------------------------------------------------------ */
  /* 价格                                                               */
  /* ------------------------------------------------------------------ */
  function price(serverId, level) {
    ensure();
    serverId = serverId || Store.state.serverId;
    const ts = C.seedTimestamp ? C.seedTimestamp() : Date.now();
    const bucket = (Store.state.stonePrices || {})[serverId] || {};
    const stored = bucket[String(level)] || bucket[level];
    if (stored && Number.isFinite(Number(stored.v))) {
      return {
        v: Number(stored.v), t: stored.t || ts, user: true, seed: false,
        missing: !(Number(stored.v) > 0), quote: true
      };
    }
    const seedBucket = (DATA.stonePrices || {})[serverId] || {};
    const seed = Number(seedBucket[String(level)]);
    if (seed > 0) {
      return { v: seed, t: ts, user: false, seed: true, missing: false, quote: true };
    }
    const base = Number(levelInfo(level).base) || 0;
    return { v: base, t: ts, user: false, seed: true, missing: !(base > 0), quote: false };
  }

  function setPrice(serverId, level, value) {
    ensure();
    serverId = serverId || Store.state.serverId;
    if (!Store.state.stonePrices[serverId]) Store.state.stonePrices[serverId] = {};
    if (value === '' || value == null) {
      delete Store.state.stonePrices[serverId][String(level)];
      Store.save();
      return true;
    }
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0) return false;
    Store.state.stonePrices[serverId][String(level)] = { v: U.round(n, 2), t: Date.now() };
    Store.save();
    return true;
  }

  function clearPrice(serverId, level) {
    ensure();
    serverId = serverId || Store.state.serverId;
    if (Store.state.stonePrices[serverId]) {
      delete Store.state.stonePrices[serverId][String(level)];
    }
    Store.save();
    return true;
  }

  function netPrice(serverId, level, rate) {
    const p = price(serverId, level);
    return U.round(p.v * (1 - (rate == null ? taxRate() : rate)), 4);
  }

  /* ------------------------------------------------------------------ */
  /* 公式                                                               */
  /* ------------------------------------------------------------------ */
  function sanitizeRecipe(r) {
    r = r || {};
    const target = Math.max(2, Math.min(8, Math.round(num(r.target) || 3)));
    return {
      id: r.id || ('stone_custom_' + Date.now().toString(36)),
      name: r.name || '未命名公式',
      mode: ['fast', 'optimal', 'jackpot'].indexOf(r.mode) >= 0 ? r.mode : 'optimal',
      target: target,
      primary: Math.max(1, Math.min(8, Math.round(num(r.primary) || target))),
      inputs: (r.inputs || []).filter(function (x) {
        return x && num(x.level) >= 1 && num(x.level) <= 8 && num(x.qty) > 0;
      }).map(function (x) {
        return { level: Math.round(num(x.level)), qty: Math.max(1, Math.round(num(x.qty))) };
      }),
      fee: Math.max(0, num(r.fee)),
      energy: Math.max(0, num(r.energy)),
      outcomes: (r.outcomes || []).filter(function (x) {
        return x && num(x.level) >= 1 && num(x.level) <= 8;
      }).map(function (x) {
        return { level: Math.round(num(x.level)), chance: clamp01(x.chance) };
      }),
      verified: !!r.verified,
      source: r.source || '',
      note: r.note || '',
      custom: !!r.custom,
      edited: !!r.edited
    };
  }

  function recipes() { ensure(); return Store.state.stoneRecipes || []; }
  function recipe(id) { return recipes().find(function (r) { return r.id === id; }) || null; }

  function addRecipe(r) {
    ensure();
    const next = sanitizeRecipe(r);
    next.id = 'stone_custom_' + Date.now().toString(36);
    next.custom = true;
    next.edited = true;
    Store.state.stoneRecipes.push(next);
    Store.log('新增五行石公式 · ' + next.name);
    Store.save();
    return next;
  }

  function updateRecipe(r) {
    ensure();
    const idx = Store.state.stoneRecipes.findIndex(function (x) { return x.id === r.id; });
    if (idx < 0) return false;
    const next = sanitizeRecipe(r);
    next.custom = Store.state.stoneRecipes[idx].custom;
    next.edited = true;
    Store.state.stoneRecipes[idx] = next;
    Store.log('修改五行石公式 · ' + next.name);
    Store.save();
    return true;
  }

  function deleteRecipe(id) {
    ensure();
    const idx = Store.state.stoneRecipes.findIndex(function (r) { return r.id === id; });
    if (idx < 0 || !Store.state.stoneRecipes[idx].custom) return false;
    const name = Store.state.stoneRecipes[idx].name;
    Store.state.stoneRecipes.splice(idx, 1);
    Store.log('删除五行石公式 · ' + name);
    Store.save();
    return true;
  }

  function resetRecipe(id) {
    ensure();
    const def = (DATA.stoneRecipes || []).find(function (r) { return r.id === id; });
    if (!def) return false;
    const idx = Store.state.stoneRecipes.findIndex(function (r) { return r.id === id; });
    if (idx < 0) return false;
    Store.state.stoneRecipes[idx] = clone(def);
    Store.log('恢复五行石公式 · ' + def.name);
    Store.save();
    return true;
  }

  function resetAll() {
    ensure();
    Store.state.stoneRecipes = clone(DATA.stoneRecipes || []);
    Store.state.stoneFormulaVersion = META.version || 'stone-v1';
    Store.log('恢复全部五行石默认公式');
    Store.save();
    return true;
  }

  function setChance(id, level, chance) {
    ensure();
    const r = recipe(id);
    if (!r) return false;
    let row = r.outcomes.find(function (o) { return o.level === level; });
    if (!row) { row = { level: level, chance: 0 }; r.outcomes.push(row); }
    row.chance = clamp01(chance);
    r.edited = true;
    Store.save();
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* 计算                                                               */
  /* ------------------------------------------------------------------ */
  function marketPlan(serverId) {
    const plan = {};
    LEVELS.forEach(function (l) {
      plan[l.level] = {
        level: l.level, cost: price(serverId, l.level).v, energy: 0,
        source: 'market', recipeId: null
      };
    });
    return plan;
  }

  function breakEven(r, cost, outcomeValue, targetNet, serverId) {
    r = sanitizeRecipe(r);
    if (r.target === r.primary) {
      let otherValue = 0;
      r.outcomes.forEach(function (o) {
        if (o.level !== r.target) otherValue += o.chance * netPrice(serverId, o.level);
      });
      const p = targetNet > 0 ? (cost - otherValue) / targetNet : null;
      return { p: p, kind: 'success', valid: p != null && p >= 0 && p <= 1 };
    }
    let otherChance = 0;
    let otherValue = 0;
    r.outcomes.forEach(function (o) {
      if (o.level === r.target || o.level === r.primary) return;
      otherChance += o.chance;
      otherValue += o.chance * netPrice(serverId, o.level);
    });
    const primaryNet = netPrice(serverId, r.primary);
    const denom = targetNet - primaryNet;
    if (!(denom > 0)) return { p: null, kind: 'jackpot', valid: false, otherChance: otherChance };
    const p = (cost - (1 - otherChance) * primaryNet - otherValue) / denom;
    return { p: p, kind: 'jackpot', valid: p != null && p >= 0 && p <= 1, otherChance: otherChance };
  }

  function evalRecipe(r, plan, opts) {
    opts = opts || {};
    const serverId = opts.serverId || Store.state.serverId;
    r = sanitizeRecipe(r);
    let inputCost = 0;
    let inputEnergy = 0;
    let missing = 0;
    r.inputs.forEach(function (inp) {
      const node = (plan && plan[inp.level]) ? plan[inp.level] : {
        cost: price(serverId, inp.level).v, energy: 0, source: 'market'
      };
      inputCost += num(node.cost) * inp.qty;
      inputEnergy += num(node.energy) * inp.qty;
      if (!(num(node.cost) > 0)) missing++;
    });
    const cost = inputCost + r.fee;
    let targetChance = 0;
    let primaryChance = 0;
    let outcomeValue = 0;
    let byproductValue = 0;
    r.outcomes.forEach(function (o) {
      const np = netPrice(serverId, o.level);
      outcomeValue += o.chance * np;
      if (o.level === r.target) targetChance += o.chance;
      if (o.level === r.primary) primaryChance += o.chance;
      if (o.level !== r.target) byproductValue += o.chance * np;
      if (!(np > 0)) missing++;
    });
    const targetNet = netPrice(serverId, r.target);
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
      targetNet: targetNet, primaryNet: netPrice(serverId, r.primary),
      costPerTarget: costPerTarget, energyPerTarget: energyPerTarget,
      profitPerTarget: profitPerTarget, perEnergyTarget: perEnergyTarget,
      profitPerAttempt: profitPerAttempt, perEnergyAttempt: perEnergyAttempt,
      margin: outcomeValue > 0 ? profitPerAttempt / outcomeValue : null,
      roi: cost > 0 ? profitPerAttempt / cost : null,
      missing: missing > 0,
      breakEven: breakEven(r, cost, outcomeValue, targetNet, serverId)
    };
  }

  function buildPlan(mode, opts) {
    opts = opts || {};
    const serverId = opts.serverId || Store.state.serverId;
    const plan = { 1: { level: 1, cost: price(serverId, 1).v, energy: 0, source: 'market', recipeId: null } };
    const allowMarket = mode.indexOf('buy') === 0;
    for (let level = 2; level <= 8; level++) {
      const market = { level: level, cost: price(serverId, level).v, energy: 0, source: 'market', recipeId: null };
      const candidates = [];
      if (allowMarket) candidates.push(market);
      recipes().filter(function (r) { return r.target === level; }).forEach(function (r) {
        const ev = evalRecipe(r, plan, opts);
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

  function rows(opts) {
    opts = opts || {};
    const serverId = opts.serverId || Store.state.serverId;
    const craftGold = buildPlan('craft-gold', opts);
    const craftEnergy = buildPlan('craft-energy', opts);
    const craftProfit = buildPlan('craft-profit', opts);
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
      recipes().filter(function (r) { return r.target === level && r.mode === 'fast'; }).forEach(function (r) {
        const ev = evalRecipe(r, craftGold, opts);
        pushUnique(ev, '快速合成', 'fast');
      });
      plans.forEach(function (p) {
        const node = p.plan[level];
        if (!node || node.source !== 'craft') return;
        const r = recipe(node.recipeId);
        if (!r) return;
        const ev = evalRecipe(r, p.plan, opts);
        pushUnique(ev, p.label, p.key);
      });
      recipes().filter(function (r) { return r.target === level && r.mode !== 'fast'; }).forEach(function (r) {
        if (out.some(function (x) { return x.recipe.id === r.id; })) return;
        const ev = evalRecipe(r, craftGold, opts);
        pushUnique(ev, '备选', 'gold');
      });
    });

    const market = marketPlan(serverId);
    recipes().filter(function (r) { return r.target >= 7; }).forEach(function (r) {
      const ev = evalRecipe(r, market, opts);
      pushUnique(ev, '赌跳级', 'market');
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

  function summary(opts) {
    const all = rows(opts);
    const best = {};
    [3, 4, 5, 6].forEach(function (l) { best[l] = pickBest(all, l); });
    const bestOverall = [3, 4, 5, 6].map(function (l) { return best[l]; })
      .filter(Boolean)
      .sort(function (a, b) { return b.perEnergyTarget - a.perEnergyTarget; })[0] || null;
    const be7 = all.find(function (r) { return r.recipe.id === 'jack_7'; }) || null;
    const be8 = all.find(function (r) { return r.recipe.id === 'jack_8'; }) || null;
    const be8alt = all.find(function (r) { return r.recipe.id === 'jack_8_alt'; }) || null;
    const be8from4 = all.find(function (r) { return r.recipe.id === 'jack_8_from4'; }) || null;
    const fast5 = all.find(function (r) { return r.recipe.id === 'fast_5'; }) || null;
    const fast6 = all.find(function (r) { return r.recipe.id === 'fast_6'; }) || null;
    return {
      all: all, best: best, bestOverall: bestOverall,
      be7: be7, be8: be8, be8alt: be8alt, be8from4: be8from4,
      fast5: fast5, fast6: fast6, taxRate: taxRate()
    };
  }

  window.JX3Stone = {
    meta: META,
    levels: LEVELS,
    levelInfo: levelInfo,
    levelName: levelName,
    taxRate: taxRate,
    priceUpdatedAt: priceUpdatedAt,
    price: price,
    netPrice: netPrice,
    setPrice: setPrice,
    clearPrice: clearPrice,
    recipes: recipes,
    recipe: recipe,
    addRecipe: addRecipe,
    updateRecipe: updateRecipe,
    deleteRecipe: deleteRecipe,
    resetRecipe: resetRecipe,
    resetAll: resetAll,
    setChance: setChance,
    sanitizeRecipe: sanitizeRecipe,
    marketPlan: marketPlan,
    buildPlan: buildPlan,
    evalRecipe: evalRecipe,
    rows: rows,
    summary: summary,
    ensure: ensure
  };
})();
