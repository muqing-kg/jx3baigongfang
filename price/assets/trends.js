/* =========================================================================
   物价助手 · 物价历史读取与走势数据
   -------------------------------------------------------------------------
   - 从 Pages 的 price-history/index.json + days/*.json 读取历史
   - 按区服回放 base + samples，得到每个节点的本服报价/基准价/有效价
   - 提供蜡烛图、散点图、节点原始数据所需的纯数据函数
   该文件只服务 Web 版；小红书离线小工具不加载它。
   ========================================================================= */
(function () {
  'use strict';

  const DATA = window.JX3Data || {};
  const listeners = [];
  const state = {
    index: null,
    days: Object.create(null),
    loadingIndex: null,
    loadingDays: Object.create(null),
    indexError: null,
    dayError: null,
    lastLoadedAt: 0
  };

  const skillMap = {};
  (DATA.skills || []).forEach(function (s) { skillMap[s.id] = s; });
  const skillOrder = {};
  (DATA.skills || []).forEach(function (s, i) { skillOrder[s.id] = i; });
  const tierMap = {};
  (DATA.tiers || []).forEach(function (t) { tierMap[t.id] = t; });
  const usageSkills = Object.create(null);
  (DATA.recipes || []).forEach(function (recipe) {
    (recipe.materials || []).forEach(function (mat) {
      if (!mat || !mat.item) return;
      const list = usageSkills[mat.item] || (usageSkills[mat.item] = []);
      if (recipe.skillId && list.indexOf(recipe.skillId) === -1) list.push(recipe.skillId);
    });
  });

  const STONE_COLOR = '#C084FC';
  const catalog = [];
  (DATA.items || []).forEach(function (item) {
    if (!item || !item.id) return;
    const kind = item.kind === 'product' ? 'product' : 'material';
    const used = (usageSkills[item.id] || []).slice();
    if (item.skillId && used.indexOf(item.skillId) === -1) used.unshift(item.skillId);
    catalog.push({
      key: 'item:' + item.id,
      id: item.id,
      name: item.name || item.id,
      kind: kind,
      skillId: item.skillId || '',
      skillName: skillName(item.skillId),
      skillIds: used.length ? used : (item.skillId ? [item.skillId] : []),
      skillNames: (used.length ? used : (item.skillId ? [item.skillId] : [])).map(skillName).join(' / '),
      color: skillColor(item.skillId),
      skillOrder: skillOrder[item.skillId] == null ? 99 : skillOrder[item.skillId],
      tier: Number(item.tier) || 0,
      tierName: (tierMap[item.tier] || {}).name || '其他',
      tierColor: (tierMap[item.tier] || {}).color || '#64748B'
    });
  });
  (DATA.stones || []).forEach(function (stone) {
    if (!stone || stone.level === undefined) return;
    catalog.push({
      key: 'stone:' + stone.level,
      id: 'stone:' + stone.level,
      level: String(stone.level),
      name: stone.name || ('五行石（' + stone.level + '级）'),
      kind: 'stone',
      skillId: 'stone',
      skillName: '五行石',
      color: STONE_COLOR,
      skillOrder: 100,
      tier: 0,
      tierName: '五行石',
      tierColor: STONE_COLOR
    });
  });
  const itemMap = {};
  catalog.forEach(function (item) { itemMap[item.key] = item; });

  function skillName(id) {
    return skillMap[id] ? skillMap[id].name : (id || '其他');
  }
  function skillColor(id) {
    return skillMap[id] && skillMap[id].color ? skillMap[id].color : '#64748B';
  }
  function clone(value) {
    if (value === null || value === undefined) return value;
    return JSON.parse(JSON.stringify(value));
  }
  function isPrice(value) {
    return typeof value === 'number' && Number.isFinite(value) && value > 0;
  }
  function atText(at) {
    const text = String(at || '');
    return text.length >= 16 ? text.slice(0, 16).replace('T', ' ') : text;
  }
  function dateOf(at) {
    const text = String(at || '');
    return text.slice(0, 10);
  }
  function beijingParts(ms) {
    const d = new Date(ms + 8 * 3600000);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      hour: d.getUTCHours()
    };
  }
  function beijingDateOf(ms) {
    const p = beijingParts(ms);
    return p.year + '-' + String(p.month).padStart(2, '0') + '-' + String(p.day).padStart(2, '0');
  }
  function hourText(ms) {
    const p = beijingParts(ms);
    return p.year + '-' + String(p.month).padStart(2, '0') + '-' + String(p.day).padStart(2, '0') +
      'T' + String(p.hour).padStart(2, '0') + ':00';
  }
  function floorHourMs(ms) {
    const p = beijingParts(ms);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour) - 8 * 3600000;
  }
  function endOfHourMs(ms) {
    return floorHourMs(ms) + 3599999;
  }
  function parseBound(value, isEnd) {
    const text = String(value || '').trim();
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2})(?::\d{2})?(?::\d{2})?)?$/);
    if (!match) return null;
    const date = match[1] + '-' + match[2] + '-' + match[3];
    if (match[4] === undefined) {
      const start = Date.parse(date + 'T00:00:00+08:00');
      return Number.isFinite(start) ? (isEnd ? start + 86399999 : start) : null;
    }
    const start = Date.parse(date + 'T' + match[4] + ':00:00+08:00');
    if (!Number.isFinite(start)) return null;
    return isEnd ? start + 3599999 : start;
  }
  function slicePoints(points, fromMs, toMs) {
    return (points || []).filter(function (point) {
      const ms = Date.parse(point.at);
      return Number.isFinite(ms) && ms >= fromMs && ms <= toMs;
    });
  }
  function baseUrl() {
    try { return document.baseURI || location.href; } catch (err) { return 'https://localhost/'; }
  }
  function historyUrl(path) {
    let root = baseUrl();
    try {
      if (/\/dev(?:\/|$)/.test(location.pathname)) root = new URL('../', root).href;
    } catch (err) { /* ignore */ }
    return new URL('price-history/' + path, root).href;
  }
  function notify() {
    listeners.slice().forEach(function (fn) {
      try { fn(); } catch (err) { if (window.console) console.error(err); }
    });
  }
  function fetchJson(url) {
    if (typeof fetch !== 'function') return Promise.reject(new Error('当前浏览器不支持 fetch'));
    return fetch(url, { cache: 'no-cache' }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function loadIndex(force) {
    if (state.index && !force) return Promise.resolve(state.index);
    if (state.loadingIndex) return state.loadingIndex;
    state.indexError = null;
    state.loadingIndex = fetchJson(historyUrl('index.json')).then(function (index) {
      state.index = index;
      state.lastLoadedAt = Date.now();
      state.loadingIndex = null;
      notify();
      return index;
    }).catch(function (err) {
      state.indexError = err && err.message ? err.message : String(err);
      state.loadingIndex = null;
      notify();
      throw err;
    });
    return state.loadingIndex;
  }

  function loadDays(dates) {
    dates.forEach(function (date) {
      if (state.days[date] || state.loadingDays[date]) return;
      state.loadingDays[date] = fetchJson(historyUrl('days/' + date + '.json')).then(function (day) {
        state.days[date] = day;
        delete state.loadingDays[date];
        state.dayError = null;
        notify();
        return day;
      }).catch(function (err) {
        delete state.loadingDays[date];
        state.dayError = '无法加载 ' + date + ' 的物价历史：' + (err && err.message ? err.message : String(err));
        notify();
        throw err;
      });
    });
  }

  function applyServerDelta(target, delta, serverId) {
    const changes = delta && delta[serverId];
    if (!changes) return 0;
    let count = 0;
    Object.keys(changes).forEach(function (key) {
      const value = changes[key];
      if (value === null) {
        delete target[key];
        count++;
      } else if (isPrice(value)) {
        target[key] = value;
        count++;
      }
    });
    return count;
  }
  function applyFlatDelta(target, delta) {
    if (!delta) return 0;
    let count = 0;
    Object.keys(delta).forEach(function (key) {
      const value = delta[key];
      if (value === null) {
        delete target[key];
        count++;
      } else if (isPrice(value)) {
        target[key] = value;
        count++;
      }
    });
    return count;
  }
  function effectiveMap(catalogPrices, quotes) {
    const out = {};
    Object.keys(catalogPrices || {}).forEach(function (id) {
      if (isPrice(catalogPrices[id])) out[id] = catalogPrices[id];
    });
    Object.keys(quotes || {}).forEach(function (id) {
      if (isPrice(quotes[id])) out[id] = quotes[id];
    });
    return out;
  }
  function effectiveStoneMap(catalogPrices, quotes) {
    const out = {};
    Object.keys(catalogPrices || {}).forEach(function (level) {
      if (isPrice(catalogPrices[level])) out[level] = catalogPrices[level];
    });
    Object.keys(quotes || {}).forEach(function (level) {
      if (isPrice(quotes[level])) out[level] = quotes[level];
    });
    return out;
  }

  function buildPoints(serverId, days) {
    const points = [];
    (days || []).forEach(function (day) {
      if (!day || !day.base) return;
      const base = day.base;
      const quotes = clone((base.prices && base.prices[serverId]) || {});
      const stones = clone((base.stones && base.stones[serverId]) || {});
      const catalogPrices = clone(base.catalogPrices || {});
      const stoneCatalogPrices = clone(base.stoneCatalogPrices || {});
      let coverage = (base.coverage && base.coverage[serverId]) || null;
      let requested = base.requested || [];
      let source = base.source || 'seed';

      points.push(makePoint(base.at, day.date, 'base', quotes, stones, catalogPrices, stoneCatalogPrices, coverage, requested, 0, source, day));

      (day.samples || []).forEach(function (sample) {
        let changed = 0;
        changed += applyServerDelta(quotes, sample.prices, serverId);
        changed += applyServerDelta(stones, sample.stones, serverId);
        changed += applyFlatDelta(catalogPrices, sample.catalogPrices);
        changed += applyFlatDelta(stoneCatalogPrices, sample.stoneCatalogPrices);
        if (sample.coverage && sample.coverage[serverId]) coverage = sample.coverage[serverId];
        if (sample.requested) requested = sample.requested;
        source = sample.source || 'update';
        points.push(makePoint(sample.at, day.date, 'update', quotes, stones, catalogPrices, stoneCatalogPrices, coverage, requested, changed, source, day));
      });
    });
    points.sort(function (a, b) { return Date.parse(a.at) - Date.parse(b.at); });
    return points;
  }

  function makePoint(at, date, kind, quotes, stones, catalogPrices, stoneCatalogPrices, coverage, requested, changed, source, day) {
    const prices = effectiveMap(catalogPrices, quotes);
    const stonePrices = effectiveStoneMap(stoneCatalogPrices, stones);
    return {
      at: at,
      date: date,
      kind: kind,
      source: source,
      quotes: clone(quotes),
      stones: clone(stones),
      catalog: clone(catalogPrices),
      stoneCatalog: clone(stoneCatalogPrices),
      prices: prices,
      stonePrices: stonePrices,
      coverage: coverage,
      requested: requested || [],
      changed: changed,
      quoteCount: Object.keys(quotes || {}).length,
      stoneCount: Object.keys(stones || {}).length,
      pricedCount: Object.keys(prices || {}).length,
      itemCount: Number(day && day.itemCount) || ((DATA.items || []).length)
    };
  }

  function items(type, skillId) {
    let list = catalog.slice();
    if (type === 'material' || type === 'product' || type === 'stone') {
      list = list.filter(function (item) { return item.kind === type; });
    }
    if (skillId === 'stone') {
      list = list.filter(function (item) { return item.kind === 'stone'; });
    } else if (skillId) {
      list = list.filter(function (item) {
        return item.kind !== 'stone' && (item.skillIds || [item.skillId]).indexOf(skillId) !== -1;
      });
    }
    list.sort(function (a, b) {
      if (a.skillOrder !== b.skillOrder) return a.skillOrder - b.skillOrder;
      if (a.kind !== b.kind) return a.kind === 'product' ? -1 : 1;
      if (a.tier !== b.tier) return b.tier - a.tier;
      return String(a.name).localeCompare(String(b.name), 'zh-CN');
    });
    return list;
  }

  function item(key) {
    return itemMap[key] || null;
  }

  function priceOf(point, meta) {
    if (!point || !meta) return null;
    if (meta.kind === 'stone') {
      const value = point.stonePrices && point.stonePrices[meta.level];
      return isPrice(value) ? value : null;
    }
    const value = point.prices && point.prices[meta.id];
    return isPrice(value) ? value : null;
  }

  function itemSeries(points, key) {
    const meta = item(key);
    if (!meta) return [];
    const out = [];
    (points || []).forEach(function (point) {
      const price = priceOf(point, meta);
      if (!isPrice(price)) return;
      let quote = null;
      if (meta.kind === 'stone') quote = point.stones && point.stones[meta.level];
      else quote = point.quotes && point.quotes[meta.id];
      out.push({
        at: point.at,
        date: point.date,
        price: price,
        quote: isPrice(quote) ? quote : null,
        source: isPrice(quote) ? '本服报价' : '基准价'
      });
    });
    return out;
  }

  function candles(series, opts) {
    opts = opts || {};
    const data = (series || []).filter(function (d) { return isPrice(d.price); });
    if (data.length < 2) return [];
    const dateCount = new Set(data.map(function (d) { return d.date; })).size;
    const daily = !!opts.daily || (data.length > 60 && dateCount > 1);
    if (daily) {
      const groups = {};
      const order = [];
      data.forEach(function (d) {
        if (!groups[d.date]) { groups[d.date] = []; order.push(d.date); }
        groups[d.date].push(d);
      });
      return order.map(function (date) {
        const list = groups[date];
        const first = list[0];
        const last = list[list.length - 1];
        const prices = list.map(function (d) { return d.price; });
        return {
          at: last.at,
          date: date,
          open: first.price,
          close: last.price,
          high: Math.max.apply(null, prices),
          low: Math.min.apply(null, prices),
          count: list.length,
          source: last.source
        };
      });
    }
    const out = [];
    for (let i = 1; i < data.length; i++) {
      const prev = data[i - 1];
      const cur = data[i];
      out.push({
        at: cur.at,
        date: cur.date,
        open: prev.price,
        close: cur.price,
        high: Math.max(prev.price, cur.price),
        low: Math.min(prev.price, cur.price),
        count: 1,
        source: cur.source
      });
    }
    return out;
  }

  function scatter(points, opts) {
    opts = opts || {};
    const scope = items(opts.type || 'all', opts.skillId || '');
    const metric = opts.metric === 'change' ? 'change' : 'price';
    const highlight = opts.highlightKey || '';
    const first = {};
    (points || []).forEach(function (point) {
      scope.forEach(function (meta) {
        if (first[meta.key] != null) return;
        const price = priceOf(point, meta);
        if (isPrice(price)) first[meta.key] = price;
      });
    });
    const rows = [];
    (points || []).forEach(function (point) {
      scope.forEach(function (meta) {
        const price = priceOf(point, meta);
        if (!isPrice(price)) return;
        const base = first[meta.key];
        if (metric === 'change' && !isPrice(base)) return;
        const change = metric === 'change' ? (price / base - 1) * 100 : null;
        rows.push({
          at: point.at,
          date: point.date,
          itemKey: meta.key,
          itemId: meta.id,
          name: meta.name,
          kind: meta.kind,
          skillId: meta.skillId,
          skillName: meta.skillName,
          tierName: meta.tierName,
          color: meta.tierColor || meta.color,
          price: price,
          basePrice: base,
          change: change,
          source: point.quotes && isPrice(point.quotes[meta.id]) ? '本服报价'
            : point.stones && isPrice(point.stones[meta.level]) ? '本服报价' : '基准价',
          highlight: meta.key === highlight
        });
      });
    });
    const total = rows.length;
    const maxRows = opts.maxRows || 2600;
    let shown = rows;
    if (rows.length > maxRows) {
      const marked = rows.filter(function (row) { return row.highlight; });
      const rest = rows.filter(function (row) { return !row.highlight; });
      const budget = Math.max(1, maxRows - marked.length);
      const step = Math.max(1, Math.ceil(rest.length / budget));
      shown = marked.concat(rest.filter(function (_, index) { return index % step === 0; }));
    }
    shown.sort(function (a, b) {
      if (a.highlight !== b.highlight) return a.highlight ? 1 : -1;
      return Date.parse(a.at) - Date.parse(b.at);
    });
    return { rows: shown, total: total, shown: shown.length, scope: scope.length, metric: metric };
  }

  function scopeStats(points, opts) {
    opts = opts || {};
    const scope = items(opts.type || 'all', opts.skillId || '');
    let priced = 0;
    let top = null;
    scope.forEach(function (meta) {
      const series = itemSeries(points, meta.key);
      if (!series.length) return;
      priced++;
      if (series.length < 2) return;
      const first = series[0];
      const last = series[series.length - 1];
      if (!isPrice(first.price) || !isPrice(last.price)) return;
      const change = last.price / first.price - 1;
      if (!top || Math.abs(change) > Math.abs(top.change)) {
        top = {
          key: meta.key,
          name: meta.name,
          skillName: meta.skillName,
          change: change,
          first: first.price,
          last: last.price,
          from: first.at,
          to: last.at
        };
      }
    });
    const latest = (points && points.length) ? points[points.length - 1] : null;
    return {
      itemCount: scope.length,
      pricedCount: priced,
      topMover: top,
      latest: latest,
      coverage: latest && latest.coverage ? latest.coverage : null
    };
  }

  function view(serverId, opts) {
    opts = opts || {};
    if (state.indexError) {
      return { status: 'error', error: state.indexError, index: state.index };
    }
    if (!state.index) {
      loadIndex().catch(function () {});
      return { status: 'loading', index: null };
    }
    const allDates = state.index.days.map(function (d) { return d.date; }).sort();
    if (!allDates.length) {
      return { status: 'ready', index: state.index, dates: [], points: [], from: '', to: '', allFrom: '', allTo: '' };
    }
    const firstDate = allDates[0];
    const lastDate = allDates[allDates.length - 1];
    let allFrom = firstDate + 'T00:00';
    let allTo = lastDate + 'T23:00';
    const requestedFrom = parseBound(opts.from, false);
    const requestedTo = parseBound(opts.to, true);
    const fromDay = requestedFrom != null ? beijingDateOf(requestedFrom) : firstDate;
    const toDay = requestedTo != null ? beijingDateOf(requestedTo) : lastDate;
    let dayFrom = fromDay < firstDate ? firstDate : fromDay;
    let dayTo = toDay > lastDate ? lastDate : toDay;
    if (dayFrom > dayTo) { const tmp = dayFrom; dayFrom = dayTo; dayTo = tmp; }
    const dates = allDates.filter(function (date) { return date >= dayFrom && date <= dayTo; });
    const placeholderFrom = requestedFrom != null ? hourText(requestedFrom) : dayFrom + 'T00:00';
    const placeholderTo = requestedTo != null ? hourText(requestedTo) : dayTo + 'T23:00';
    if (state.dayError) {
      return {
        status: 'error', error: state.dayError, index: state.index, dates: dates,
        from: placeholderFrom, to: placeholderTo, allFrom: allFrom, allTo: allTo
      };
    }
    const missing = dates.filter(function (date) { return !state.days[date]; });
    if (missing.length) {
      loadDays(missing);
      return {
        status: 'loading', index: state.index, dates: dates,
        from: placeholderFrom, to: placeholderTo,
        allFrom: allFrom, allTo: allTo,
        loaded: dates.length - missing.length, total: dates.length
      };
    }
    const allPoints = buildPoints(serverId, dates.map(function (date) { return state.days[date]; }));
    if (allPoints.length) {
      allFrom = hourText(floorHourMs(Date.parse(allPoints[0].at)));
      allTo = hourText(floorHourMs(Date.parse(allPoints[allPoints.length - 1].at)));
    }
    const allFromMs = parseBound(allFrom, false);
    const allToMs = parseBound(allTo, true);
    let fromMs;
    let toMs;
    if (allPoints.length) {
      fromMs = requestedFrom != null ? requestedFrom : floorHourMs(Date.parse(allPoints[0].at));
      toMs = requestedTo != null ? requestedTo : endOfHourMs(Date.parse(allPoints[allPoints.length - 1].at));
    } else {
      fromMs = requestedFrom != null ? requestedFrom : allFromMs;
      toMs = requestedTo != null ? requestedTo : allToMs;
    }
    if (fromMs < allFromMs) fromMs = allFromMs;
    if (toMs > allToMs) toMs = allToMs;
    if (fromMs > toMs) { const tmp = fromMs; fromMs = toMs; toMs = tmp; }
    const points = slicePoints(allPoints, fromMs, toMs);
    return {
      status: 'ready', index: state.index, dates: dates, points: points,
      from: hourText(fromMs), to: hourText(toMs),
      allFrom: allFrom, allTo: allTo
    };
  }

  function reset() {
    state.index = null;
    state.days = Object.create(null);
    state.loadingIndex = null;
    state.loadingDays = Object.create(null);
    state.indexError = null;
    state.dayError = null;
  }
  function refresh() {
    reset();
    notify();
  }
  function retry() {
    state.indexError = null;
    state.dayError = null;
    notify();
  }
  function onUpdate(fn) {
    if (typeof fn !== 'function') return function () {};
    listeners.push(fn);
    return function () {
      const index = listeners.indexOf(fn);
      if (index >= 0) listeners.splice(index, 1);
    };
  }

  window.JX3Trends = {
    view: view,
    items: items,
    item: item,
    itemSeries: itemSeries,
    candles: candles,
    scatter: scatter,
    scopeStats: scopeStats,
    onUpdate: onUpdate,
    reset: reset,
    refresh: refresh,
    retry: retry,
    state: state,
    _test: {
      buildPoints: buildPoints,
      itemSeries: itemSeries,
      candles: candles,
      scatter: scatter,
      scopeStats: scopeStats,
      items: items,
      item: item,
      atText: atText,
      parseBound: parseBound,
      hourText: hourText,
      floorHourMs: floorHourMs,
      endOfHourMs: endOfHourMs,
      slicePoints: slicePoints
    }
  };
})();
