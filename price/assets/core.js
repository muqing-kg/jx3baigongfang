/* =========================================================================
   物价助手 · 核心：状态、持久化、价格种子、成本计算、路由
   ========================================================================= */
(function () {
  'use strict';

  const DATA = window.JX3Data;
  const CANON = {};
  (DATA.items || []).forEach(function (i) { CANON[i.id] = i; });
  const STORAGE_KEY = 'jx3-ledger-v1';
  const FALLBACK_TS = Date.parse('2026-11-18T09:00:00+08:00');
  let SEED_TS = Date.parse(DATA.meta && DATA.meta.priceUpdatedAt) || FALLBACK_TS;
  function seedTimestamp() {
    return Date.parse(DATA.meta && DATA.meta.priceUpdatedAt) || SEED_TS;
  }

  /* ------------------------------------------------------------------ */
  /* 工具                                                               */
  /* ------------------------------------------------------------------ */
  const U = {
    clone: function (v) {
      return v == null ? v : JSON.parse(JSON.stringify(v));
    },
    esc: function (s) {
      return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    },
    num: function (v) {
      const n = Number(v);
      return Number.isFinite(n) ? n : 0;
    },
    round: function (v, d) {
      const f = Math.pow(10, d == null ? 2 : d);
      return Math.round((Number(v) + Number.EPSILON) * f) / f;
    },
    fmt: function (v, d) {
      if (v == null || !Number.isFinite(Number(v))) return '—';
      const digits = d == null ? 2 : d;
      return Number(v).toLocaleString('zh-CN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
      });
    },
    fmtInt: function (v) {
      if (v == null || !Number.isFinite(Number(v))) return '—';
      return Math.round(Number(v)).toLocaleString('zh-CN');
    },
    fmtPct: function (v, d) {
      if (v == null || !Number.isFinite(Number(v))) return '—';
      return (v * 100).toFixed(d == null ? 0 : d) + '%';
    },
    fmtSigned: function (v, d) {
      if (v == null || !Number.isFinite(Number(v))) return '—';
      const s = U.fmt(Math.abs(v), d);
      return (v > 0 ? '+' : v < 0 ? '−' : '') + s;
    },
    fmtTime: function (ts) {
      if (!ts) return '—';
      const d = new Date(ts);
      const p = function (n) { return String(n).padStart(2, '0'); };
      return p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    },
    hash: function (str) {
      let h = 2166136261;
      for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    },
    debounce: function (fn, wait) {
      let t = null;
      return function () {
        const args = arguments, self = this;
        clearTimeout(t);
        t = setTimeout(function () { fn.apply(self, args); }, wait);
      };
    },
    download: function (filename, content, mime) {
      const blob = content instanceof Blob ? content : new Blob([content], { type: mime || 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      setTimeout(function () {
        URL.revokeObjectURL(url);
        a.remove();
      }, 300);
    },
    csv: function (rows) {
      return '\ufeff' + rows.map(function (row) {
        return row.map(function (cell) {
          const s = String(cell == null ? '' : cell);
          return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
        }).join(',');
      }).join('\r\n');
    },
    includes: function (haystack, needle) {
      return String(haystack || '').toLowerCase().indexOf(String(needle || '').toLowerCase()) !== -1;
    }
  };

  /* ------------------------------------------------------------------ */
  /* 索引                                                               */
  /* ------------------------------------------------------------------ */
  const Index = {
    skills: {},
    tiers: {},
    items: {},
    servers: {}
  };
  DATA.skills.forEach(function (s) { Index.skills[s.id] = s; });
  DATA.tiers.forEach(function (t) { Index.tiers[t.id] = t; });

  function skillOf(id) { return Index.skills[id] || { id: id, name: id, type: 'craft', icon: 'hammer', desc: '' }; }
  function tierOf(id) { return Index.tiers[id] || Index.tiers[1]; }
  function itemOf(id) {
    return Store.state ? Store.state.items.find(function (i) { return i.id === id; }) : null;
  }
  function recipeOf(id) {
    return Store.state ? Store.state.recipes.find(function (r) { return r.id === id; }) : null;
  }
  function serverOf(id) {
    return Store.state ? Store.state.servers.find(function (s) { return s.id === id; }) : null;
  }
  function itemsOfSkill(skillId) {
    return Store.state.items.filter(function (i) { return i.skillId === skillId; });
  }
  function recipesOfSkill(skillId) {
    return Store.state.recipes.filter(function (r) { return r.skillId === skillId; });
  }

  /* ------------------------------------------------------------------ */
  /* 状态                                                               */
  /* ------------------------------------------------------------------ */
  const DEFAULT_SERVER_ID = DATA.servers.some(function (s) { return s.id === 's_feilong'; })
    ? 's_feilong'
    : DATA.servers[0].id;

  function seedState() {
    return {
      schema: 4,
      seedVersion: DATA.meta.seedVersion,
      serverId: DEFAULT_SERVER_ID,
      servers: U.clone(DATA.servers),
      items: U.clone(DATA.items),
      recipes: U.clone(DATA.recipes),
      prices: {},
      settings: {
        energyBudget: 3000,
        gatherEnergy: 40,
        craftEnergy: 100,
        basis: 'market',
        includeIncomplete: false,
        taxRate: 0.05,
        taxRateVersion: 1,
        theme: 'light',
        themePicked: false,
        themeVersion: 1
      },
      seq: { item: 1, recipe: 1 },
      activity: []
    };
  }

  const Store = {
    state: null,
    storageOk: true,

    init: function () {
      let saved = null;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) saved = JSON.parse(raw);
      } catch (err) {
        this.storageOk = false;
      }
      if (!saved || !Array.isArray(saved.items) || !Array.isArray(saved.recipes)) {
        this.state = seedState();
      } else {
        this.state = this.normalize(saved);
      }
      this.index();
      this.save();
      return this.state;
    },

    normalize: function (saved) {
      const base = seedState();
      const state = Object.assign(base, saved);
      state.settings = Object.assign({}, base.settings, saved.settings || {});
      // v3.6 起默认亮色；旧数据若从未手动选过主题，迁移到亮色。
      if (!saved.settings || saved.settings.themeVersion !== 1) {
        if (!(saved.settings && saved.settings.themePicked)) state.settings.theme = 'light';
        state.settings.themeVersion = 1;
      }
      // 旧版本没有税额概念，或曾把默认税率存成 0：迁移到默认 5%。
      // 迁移后写入 taxRateVersion=1，用户之后可主动改为 0%。
      if (!saved.settings || saved.settings.taxRateVersion !== 1) {
        state.settings.taxRate = 0.05;
        state.settings.taxRateVersion = 1;
      }
      state.seq = Object.assign({}, base.seq, saved.seq || {});
      state.prices = saved.prices && typeof saved.prices === 'object' ? saved.prices : {};
      state.activity = Array.isArray(saved.activity) ? saved.activity.slice(0, 20) : [];
      if (!Array.isArray(state.servers) || !state.servers.length) state.servers = U.clone(DATA.servers);
      if (!serverOfIn(state.servers, state.serverId)) state.serverId = state.servers[0].id;

      // 数据版本升级：内置目录整体切换到当前版本，保留自定义条目与已有价格
      // （不同版本的技艺体系差异很大，不能把旧版本配方继续混入）
      if (saved.schema !== 4 || saved.seedVersion !== DATA.meta.seedVersion) {
        const customItems = (saved.items || []).filter(function (i) { return i.custom; });
        const customRecipes = (saved.recipes || []).filter(function (r) { return r.custom; });
        state.items = U.clone(DATA.items).concat(customItems.map(U.clone));
        state.recipes = U.clone(DATA.recipes).concat(customRecipes.map(U.clone));
        state.schema = 4;
        state.seedVersion = DATA.meta.seedVersion;
        state.migratedFrom = saved.seedVersion || 'unknown';
        // v3.4 起采集默认精力由旧的 20 调整为当前赛季的 40（用户自定义值不强制改）。
        if (state.settings && state.settings.gatherEnergy === 20 && saved.seedVersion !== DATA.meta.seedVersion) state.settings.gatherEnergy = 40;
      }
      // 清理/规范化配方，避免导入的备份或旧版本数据导致渲染崩溃
      state.items = (state.items || []).filter(function (i) { return i && i.id && i.name; });
      state.recipes = (state.recipes || []).filter(function (r) {
        return r && r.id && r.name && Array.isArray(r.outputs) && r.outputs.length > 0;
      }).map(function (r) {
        return Object.assign({}, r, {
          kind: r.kind === 'gather' ? 'gather' : 'craft',
          skillId: r.skillId,
          level: Number(r.level) || 1,
          tier: Number(r.tier) || 1,
          energy: Number(r.energy) || 1,
          fee: Number(r.fee) || 0,
          outputs: r.outputs.filter(function (o) { return o && o.item && Number(o.qty) > 0; }),
          materials: (r.materials || []).filter(function (m) { return m && m.item && Number(m.qty) > 0; })
        });
      }).filter(function (r) { return r.outputs.length > 0; });
      return state;
    },

    index: function () {
      Index.items = {};
      Index.servers = {};
      Index.skills = {};
      Index.tiers = {};
      DATA.skills.forEach(function (s) { Index.skills[s.id] = s; });
      DATA.tiers.forEach(function (t) { Index.tiers[t.id] = t; });
      this.state.items.forEach(function (i) { Index.items[i.id] = i; });
      this.state.servers.forEach(function (s) { Index.servers[s.id] = s; });
    },

    save: function () {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch (err) {
        this.storageOk = false;
      }
    },

    log: function (text) {
      this.state.activity.unshift({ t: Date.now(), text: text });
      this.state.activity = this.state.activity.slice(0, 16);
    },

    setServer: function (id) {
      if (!serverOf(id)) return false;
      this.state.serverId = id;
      this.save();
      return true;
    },

    addServer: function (name, region) {
      const id = 's_custom_' + Date.now().toString(36);
      this.state.servers.push({ id: id, name: name, region: region || '自定义', custom: true });
      this.save();
      return id;
    },

    removeServer: function (id) {
      if (this.state.servers.length <= 1) return false;
      const idx = this.state.servers.findIndex(function (s) { return s.id === id; });
      if (idx < 0) return false;
      this.state.servers.splice(idx, 1);
      delete this.state.prices[id];
      if (this.state.serverId === id) this.state.serverId = this.state.servers[0].id;
      this.save();
      return true;
    },

    seedPrice: function (serverId, item) {
      if (!item) return 0;
      // 价格数据单独热更新时，state.items 里的 base 可能还是旧的；
      // 内置物品统一用当前 DATA 里的基准价，自定义物品才用自身 base。
      const canonical = (!item.custom && CANON[item.id]) ? CANON[item.id] : item;
      if (!(canonical.base > 0)) return 0;
      // 优先使用 JX3BOX 该服的拍卖样本；各服统一由 scripts/update-jx3-prices.mjs 写入。
      const bucket = DATA.serverPrices && DATA.serverPrices[serverId];
      const actual = bucket && Number(bucket[canonical.id]);
      if (actual > 0) return U.round(actual, 2);
      // 已知服务器无该物品报价时回退到梦江南样本；自定义服务器保留确定性价差。
      const known = DATA.servers.some(function (s) { return s.id === serverId; });
      if (serverId === 's_mengjiangnan' || known) return U.round(canonical.base, 2);
      const h = U.hash(serverId + '|' + canonical.id);
      const jitter = 0.96 + (h % 800) / 10000;
      const skillFactor = 0.96 + (U.hash(serverId + '|' + canonical.skillId) % 700) / 10000;
      return U.round(canonical.base * jitter * skillFactor, 2);
    },

    price: function (serverId, itemId) {
      serverId = serverId || this.state.serverId;
      const item = itemOf(itemId);
      const bucket = this.state.prices[serverId] || {};
      const stored = bucket[itemId];
      if (stored && Number.isFinite(Number(stored.v))) {
        return {
          v: Number(stored.v), t: stored.t || seedTimestamp(), user: true,
          seed: false, missing: false
        };
      }
      const v = this.seedPrice(serverId, item);
      const q = DATA.serverPrices && DATA.serverPrices[serverId] && DATA.serverPrices[serverId][item.id];
      return {
        v: v, t: seedTimestamp(), user: false, seed: true, quote: q != null,
        missing: !(v > 0)
      };
    },

    setPrice: function (serverId, itemId, value, opts) {
      const item = itemOf(itemId);
      if (!item) return false;
      if (!this.state.prices[serverId]) this.state.prices[serverId] = {};
      if (value === '' || value === null || value === undefined) {
        delete this.state.prices[serverId][itemId];
        this.save();
        return true;
      }
      const n = Number(value);
      if (!Number.isFinite(n) || n < 0) return false;
      const old = this.price(serverId, itemId);
      this.state.prices[serverId][itemId] = { v: U.round(n, 2), t: Date.now() };
      if (!opts || !opts.silent) {
        if (Math.abs(old.v - n) > 0.0001) {
          this.log('校准价格 · ' + item.name + ' → ' + U.fmt(n) + ' 金');
        }
      }
      this.save();
      return true;
    },

    clearPrice: function (serverId, itemId) {
      if (this.state.prices[serverId]) {
        delete this.state.prices[serverId][itemId];
        this.save();
      }
    },

    updateSettings: function (patch) {
      Object.assign(this.state.settings, patch);
      this.save();
    },

    addItem: function (data) {
      const id = 'c_item_' + (this.state.seq.item++);
      const item = {
        id: id,
        name: data.name,
        skillId: data.skillId,
        kind: data.kind || 'material',
        tier: data.tier || 1,
        source: data.source || '自定义',
        origin: '自定义物品 · 请填写本服价格',
        base: 0,
        custom: true
      };
      this.state.items.push(item);
      Index.items[id] = item;
      this.save();
      return item;
    },

    addRecipe: function (recipe) {
      const id = 'c_recipe_' + (this.state.seq.recipe++);
      const copy = U.clone(recipe);
      copy.id = id;
      copy.custom = true;
      this.state.recipes.unshift(copy);
      this.log('新增' + (copy.kind === 'gather' ? '采集点' : '配方') + ' · ' + copy.name);
      this.save();
      return copy;
    },

    updateRecipe: function (recipe) {
      const idx = this.state.recipes.findIndex(function (r) { return r.id === recipe.id; });
      if (idx < 0) return false;
      const custom = this.state.recipes[idx].custom;
      this.state.recipes[idx] = Object.assign(U.clone(recipe), { custom: custom });
      this.log('修改' + (recipe.kind === 'gather' ? '采集点' : '配方') + ' · ' + recipe.name);
      this.save();
      return true;
    },

    deleteRecipe: function (id) {
      const idx = this.state.recipes.findIndex(function (r) { return r.id === id; });
      if (idx < 0 || !this.state.recipes[idx].custom) return false;
      const name = this.state.recipes[idx].name;
      this.state.recipes.splice(idx, 1);
      // 清理不再被任何配方引用的自定义物品
      const used = new Set();
      this.state.recipes.forEach(function (r) {
        r.outputs.forEach(function (o) { used.add(o.item); });
        (r.materials || []).forEach(function (m) { used.add(m.item); });
      });
      this.state.items = this.state.items.filter(function (it) { return !it.custom || used.has(it.id); });
      this.index();
      this.log('删除自定义配方 · ' + name);
      this.save();
      return true;
    },

    resetRecipe: function (id) {
      const original = DATA.recipes.find(function (r) { return r.id === id; });
      if (!original) return false;
      const idx = this.state.recipes.findIndex(function (r) { return r.id === id; });
      if (idx < 0) return false;
      this.state.recipes[idx] = U.clone(original);
      this.log('恢复示例配方 · ' + original.name);
      this.save();
      return true;
    },

    resetCatalog: function () {
      this.state.items = U.clone(DATA.items);
      this.state.recipes = U.clone(DATA.recipes);
      this.state.seedVersion = DATA.meta.seedVersion;
      this.state.schema = 4;
      this.log('恢复当前版本示例配方库（自定义配方已移除）');
      this.save();
      this.index();
      return true;
    },

    clearServerPrices: function (serverId) {
      delete this.state.prices[serverId];
      this.log('清空本服价格 · ' + (serverOf(serverId) ? serverOf(serverId).name : serverId));
      this.save();
    },

    resetAll: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
      this.state = seedState();
      this.index();
      this.save();
    },

    exportJSON: function () {
      return JSON.stringify({
        app: 'JX3-Ledger',
        exportedAt: new Date().toISOString(),
        state: this.state
      }, null, 2);
    },

    importJSON: function (text) {
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        throw new Error('JSON 解析失败：' + err.message);
      }
      const s = parsed && parsed.state ? parsed.state : parsed;
      if (!s || !Array.isArray(s.items) || !Array.isArray(s.recipes) || !Array.isArray(s.servers)) {
        throw new Error('备份格式不正确：缺少 items / recipes / servers');
      }
      const next = this.normalize(Object.assign(seedState(), s));
      this.state = next;
      this.index();
      this.save();
      return true;
    },

    importPrices: function (text, serverId) {
      const lines = String(text || '').split(/\r?\n/);
      const result = { applied: 0, unmatched: [], invalid: [] };
      const nameMap = {};
      this.state.items.forEach(function (i) { nameMap[i.name] = i.id; });
      const idMap = {};
      this.state.items.forEach(function (i) { idMap[i.id] = i.id; });

      if (!this.state.prices[serverId]) this.state.prices[serverId] = {};
      lines.forEach(function (raw, lineIdx) {
        const line = raw.trim();
        if (!line || lineIdx === 0 && /物品|价格|name|price/i.test(line)) return;
        const parts = line.split(/[,，\t]+|\s{2,}|[:：]/).map(function (p) { return p.trim(); }).filter(Boolean);
        let name, value;
        if (parts.length >= 2) {
          name = parts[0];
          value = parts[1];
        } else {
          const m = line.match(/^(.+?)[\s]+([0-9]+(?:\.[0-9]+)?)\s*金?$/);
          if (!m) { result.invalid.push(line); return; }
          name = m[1].trim();
          value = m[2];
        }
        const id = nameMap[name] || idMap[name];
        if (!id) { result.unmatched.push(name); return; }
        const n = Number(String(value).replace(/[^\d.-]/g, ''));
        if (!Number.isFinite(n) || n < 0) { result.invalid.push(line); return; }
        Store.state.prices[serverId][id] = { v: U.round(n, 2), t: Date.now() };
        result.applied++;
      });
      if (result.applied > 0) {
        this.log('批量导入价格 · ' + result.applied + ' 项');
        this.save();
      }
      return result;
    }
  };

  function serverOfIn(list, id) {
    return list.some(function (s) { return s.id === id; });
  }

  /* ------------------------------------------------------------------ */
  /* 计算                                                               */
  /* ------------------------------------------------------------------ */
  const Calc = {
    unitCost: function (itemId, opts, stack) {
      const serverId = opts.serverId || Store.state.serverId;
      const market = Store.price(serverId, itemId);
      const base = {
        value: market.v, market: market.v, source: 'market', recipeId: null,
        missing: !(market.v > 0), seed: market.seed
      };
      if (opts.basis !== 'min' || !Store.state) return base;
      stack = stack || [];
      if (stack.indexOf(itemId) !== -1) return base;
      const producers = Store.state.recipes.filter(function (r) {
        return r.kind === 'craft' && r.outputs.some(function (o) { return o.item === itemId; });
      });
      if (!producers.length) return base;
      const nextStack = stack.concat(itemId);
      let best = null;
      producers.forEach(function (r) {
        const c = Calc.recipe(r, opts, nextStack);
        if (c.missingMaterials) return;
        const outQty = r.outputs.reduce(function (sum, o) { return sum + (o.item === itemId ? o.qty : 0); }, 0);
        if (!(outQty > 0)) return;
        const unit = c.totalCost / outQty;
        if (!best || unit < best.value) {
          best = {
            value: unit, market: market.v, source: 'craft', recipeId: r.id,
            missing: false, seed: false
          };
        }
      });
      if (best && (market.v <= 0 || best.value < market.v - 1e-9)) return best;
      return base;
    },

    recipe: function (recipe, opts, stack) {
      const serverId = opts.serverId || Store.state.serverId;
      const materials = [];
      let materialCost = 0;
      let missingMaterials = 0;
      if (recipe.kind !== 'gather') {
        (recipe.materials || []).forEach(function (m) {
          const item = itemOf(m.item);
          const uc = Calc.unitCost(m.item, opts, stack);
          const sub = uc.value * m.qty;
          materialCost += sub;
          if (uc.missing) missingMaterials++;
          materials.push({
            itemId: m.item, name: item ? item.name : m.item, qty: m.qty,
            unit: uc.value, sub: sub, market: uc.market,
            source: uc.source, recipeId: uc.recipeId,
            missing: uc.missing, seed: uc.seed
          });
        });
      }
      const fee = U.num(recipe.fee);
      const totalCost = materialCost + fee;

      const outputs = [];
      let outputValueGross = 0;
      let missingOutputs = 0;
      (recipe.outputs || []).forEach(function (o) {
        const item = itemOf(o.item);
        const p = Store.price(serverId, o.item);
        const chance = o.chance == null ? 1 : Math.max(0, Math.min(1, Number(o.chance)));
        const expectedQty = o.qty * chance;
        const sub = p.v * expectedQty;
        outputValueGross += sub;
        if (p.missing) missingOutputs++;
        outputs.push({
          itemId: o.item, name: item ? item.name : o.item, qty: o.qty,
          chance: chance, expectedQty: U.round(expectedQty, 4),
          qtyMin: o.qtyMin, qtyMax: o.qtyMax,
          unit: p.v, sub: sub, missing: p.missing, seed: p.seed
        });
      });

      const energy = U.num(recipe.energy);
      const rawTaxRate = Number(Store.state.settings.taxRate);
      const taxRate = Number.isFinite(rawTaxRate) ? Math.max(0, Math.min(1, rawTaxRate)) : 0.05;
      const tax = outputValueGross * taxRate;
      const outputValue = outputValueGross - tax;
      const profit = outputValue - totalCost;
      const perEnergy = energy > 0 ? profit / energy : null;
      return {
        materials: materials,
        materialCost: materialCost,
        missingMaterials: missingMaterials,
        fee: fee,
        totalCost: totalCost,
        outputs: outputs,
        outputValueGross: outputValueGross,
        taxRate: taxRate,
        tax: tax,
        outputValue: outputValue,
        missingOutputs: missingOutputs,
        missing: missingMaterials + missingOutputs > 0,
        profit: profit,
        energy: energy,
        perEnergy: perEnergy,
        margin: totalCost > 0 && outputValue > 0 ? profit / outputValue : null,
        roi: totalCost > 0 ? profit / totalCost : null
      };
    },

    rows: function (opts) {
      opts = opts || {};
      const serverId = opts.serverId || Store.state.serverId;
      return Store.state.recipes.map(function (recipe) {
        const calc = Calc.recipe(recipe, { serverId: serverId, basis: opts.basis || 'market' });
        const skill = skillOf(recipe.skillId);
        const tier = tierOf(recipe.tier);
        const outputNames = recipe.outputs.map(function (o) {
          const item = itemOf(o.item);
          const qtyText = o.qtyMin != null && o.qtyMax != null && o.qtyMax > o.qtyMin
            ? o.qtyMin + '~' + o.qtyMax
            : (o.qty > 1 || recipe.kind === 'gather' ? String(o.qty) : '');
          const chance = o.chance == null ? 1 : Number(o.chance);
          const chanceText = chance < 0.999 ? '（' + (chance * 100).toFixed(chance < 0.1 ? 1 : 0) + '%）' : '';
          return (item ? item.name : o.item) + (qtyText ? ' ×' + qtyText : '') + chanceText;
        }).join(' + ');
        return {
          recipe: recipe, calc: calc, skill: skill, tier: tier,
          outputNames: outputNames, type: recipe.kind === 'gather' ? 'gather' : 'craft'
        };
      });
    },

    stats: function (serverId) {
      const items = Store.state.items;
      let user = 0, seed = 0, missing = 0;
      items.forEach(function (i) {
        const p = Store.price(serverId, i.id);
        if (p.user) user++;
        else if (p.v > 0) seed++;
        else missing++;
      });
      return {
        total: items.length, user: user, seed: seed, missing: missing,
        calibrated: items.length ? user / items.length : 0
      };
    },

    skillStats: function (rows) {
      const map = {};
      DATA.skills.forEach(function (s) {
        map[s.id] = {
          skill: s, count: 0, countComplete: 0, avg: null, best: null,
          totalProfit: 0, negative: 0, sum: 0, n: 0
        };
      });
      rows.forEach(function (row) {
        const g = map[row.recipe.skillId];
        if (!g) return;
        g.count++;
        if (!row.calc.missing && row.calc.perEnergy != null) {
          g.countComplete++;
          g.sum += row.calc.perEnergy;
          g.n++;
          if (!g.best || row.calc.perEnergy > g.best.calc.perEnergy) g.best = row;
        }
        g.totalProfit += row.calc.profit;
        if (row.calc.profit < 0) g.negative++;
      });
      Object.keys(map).forEach(function (k) {
        const g = map[k];
        g.avg = g.n ? g.sum / g.n : null;
      });
      return map;
    },

    median: function (values) {
      const arr = values.filter(function (v) { return Number.isFinite(v); }).sort(function (a, b) { return a - b; });
      if (!arr.length) return null;
      const mid = Math.floor(arr.length / 2);
      return arr.length % 2 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    },

    simulate: function (rows, budget) {
      const pool = rows.filter(function (r) {
        return !r.calc.missing && r.calc.perEnergy > 0 && r.calc.energy > 0;
      }).sort(function (a, b) { return b.calc.perEnergy - a.calc.perEnergy; });
      let remaining = Math.max(0, U.num(budget));
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
      return {
        budget: Math.max(0, U.num(budget)), profit: profit, used: used,
        remaining: remaining, allocations: allocations
      };
    },

    bestOf: function (rows) {
      let best = null;
      rows.forEach(function (r) {
        if (r.calc.missing || r.calc.perEnergy == null) return;
        if (!best || r.calc.perEnergy > best.calc.perEnergy) best = r;
      });
      return best;
    },

    coverageText: function (serverId) {
      const s = Calc.stats(serverId);
      return s.user + ' / ' + s.total;
    }
  };

  /* ------------------------------------------------------------------ */
  /* 路由                                                               */
  /* ------------------------------------------------------------------ */
  const Route = {
    parse: function () {
      const raw = location.hash.replace(/^#/, '') || '/overview';
      const idx = raw.indexOf('?');
      const path = idx === -1 ? raw : raw.slice(0, idx);
      const params = {};
      if (idx !== -1) {
        new URLSearchParams(raw.slice(idx + 1)).forEach(function (v, k) { params[k] = v; });
      }
      return { path: path || '/overview', params: params };
    },

    qs: function (params) {
      const usp = new URLSearchParams();
      Object.keys(params || {}).forEach(function (k) {
        const v = params[k];
        if (v === undefined || v === null || v === '') return;
        usp.set(k, v);
      });
      const s = usp.toString();
      return s ? '?' + s : '';
    },

    href: function (path, params) {
      const p = Object.assign({}, params || {});
      if (Store.state && Store.state.serverId && !p.server) p.server = Store.state.serverId;
      return '#' + path + Route.qs(p);
    },

    go: function (path, params, opts) {
      const href = '#' + path + Route.qs(params);
      if (opts && opts.replace) {
        history.replaceState(null, '', href);
        if (window.App && App.handleRoute) App.handleRoute(true);
      } else if (location.hash === href) {
        if (window.App && App.handleRoute) App.handleRoute(true);
      } else {
        location.hash = href;
      }
    },

    update: function (patch, opts) {
      const cur = Route.parse();
      const params = Object.assign({}, cur.params, patch);
      Object.keys(params).forEach(function (k) {
        if (params[k] === '' || params[k] === null || params[k] === undefined) delete params[k];
      });
      Route.go(cur.path, params, opts);
    },

    goPath: function (path, patch, opts) {
      const cur = Route.parse();
      const params = Object.assign({}, cur.params, patch || {});
      Route.go(path, params, opts);
    }
  };

  /* ------------------------------------------------------------------ */
  /* 导出                                                               */
  /* ------------------------------------------------------------------ */
  window.JX3Core = {
    U: U,
    Store: Store,
    Calc: Calc,
    Route: Route,
    Index: Index,
    skillOf: skillOf,
    tierOf: tierOf,
    itemOf: itemOf,
    recipeOf: recipeOf,
    serverOf: serverOf,
    itemsOfSkill: itemsOfSkill,
    recipesOfSkill: recipesOfSkill,
    SEED_TS: SEED_TS,
    seedTimestamp: seedTimestamp
  };
})();
