/* =========================================================================
   物价助手 · 图表（纯 SVG，无外部依赖）
   ========================================================================= */
(function () {
  'use strict';

  const C = window.JX3Core;
  const U = C.U;

  const DARK = {
    bg: '#020817', text: '#F8FAFC', muted: '#94A3B8', grid: 'rgba(148,163,184,.14)',
    axis: 'rgba(148,163,184,.35)'
  };
  const LIGHT = {
    bg: '#FFFFFF', text: '#0F172A', muted: '#64748B', grid: 'rgba(100,116,139,.16)',
    axis: 'rgba(100,116,139,.35)'
  };

  const COLOR = {
    craft: '#1D6FE0',
    gather: '#2E9E78',
    peak: '#B36BFF',
    danger: '#F43F5E',
    warning: '#F59E0B',
    info: '#3B82F6'
  };

  function palette(theme) {
    return theme === 'light' ? LIGHT : DARK;
  }

  function attr(s) {
    return U.esc(s);
  }

  function niceMax(v) {
    if (!(v > 0)) return 10;
    const exp = Math.floor(Math.log10(v));
    const f = v / Math.pow(10, exp);
    const nf = f <= 1 ? 1 : f <= 1.5 ? 1.5 : f <= 2 ? 2 : f <= 3 ? 3 : f <= 5 ? 5 : 10;
    return nf * Math.pow(10, exp);
  }

  function ticks(max, count) {
    const out = [];
    for (let i = 0; i <= count; i++) out.push((max / count) * i);
    return out;
  }

  function truncate(s, n) {
    s = String(s);
    return s.length > n ? s.slice(0, n - 1) + '…' : s;
  }

  function labelText(v, unit) {
    return (v > 0 ? '+' : '') + U.fmt(v, 2) + (unit || '');
  }

  function emptyChart(width, height, text, P) {
    return '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' + attr(text) + '">' +
      '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>' +
      '<text x="' + width / 2 + '" y="' + height / 2 + '" text-anchor="middle" font-size="12" fill="' + P.muted + '">' + U.esc(text) + '</text>' +
      '</svg>';
  }

  /* ------------------------------------------------------------------ */
  /* 水平条形图（排行）                                                  */
  /* ------------------------------------------------------------------ */
  function barH(rows, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const width = opts.width || 760;
    const rowH = 32;
    const top = 26;
    const left = opts.left || 166;
    const right = 74;
    const data = rows.slice(0, opts.limit || 10);
    if (!data.length) return emptyChart(width, 240, opts.emptyText || '当前筛选无数据', P);

    const height = top + data.length * rowH + 12;
    const maxVal = niceMax(Math.max.apply(null, data.map(function (d) { return Math.max(0, d.value); })) || 1);
    const plotW = width - left - right;
    const x = function (v) { return left + (Math.max(0, v) / maxVal) * plotW; };
    const tk = ticks(maxVal, 4);
    const topValue = Math.max.apply(null, data.map(function (d) { return d.value; }));
    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
      attr(opts.ariaLabel || '精力收益排行') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';

    tk.forEach(function (t) {
      const xx = x(t);
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + (top - 8) + '" x2="' + xx.toFixed(1) + '" y2="' + (height - 8) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + xx.toFixed(1) + '" y="' + (top - 14) + '" text-anchor="middle" font-size="10" fill="' + P.muted + '">' +
        U.fmt(t, 0) + '</text>';
    });

    data.forEach(function (d, i) {
      const y = top + i * rowH;
      const isTop = d.value === topValue && d.value > 0 && i === 0;
      const color = isTop ? COLOR.peak : (d.color || COLOR.craft);
      const barW = Math.max(2, x(d.value) - left);
      const tip = (d.tip || d.label) + '：' + labelText(d.value, opts.unit || '');
      svg += '<g class="chart-bar" tabindex="0" role="listitem" data-tip="' + attr(tip) + '"' +
        (d.id ? ' data-recipe="' + attr(d.id) + '"' : '') + ' aria-label="' + attr(tip) + '">';
      svg += '<rect x="0" y="' + (y - 2) + '" width="' + width + '" height="' + (rowH - 2) + '" fill="transparent"/>';
      if (isTop) {
        svg += '<rect x="0" y="' + (y - 2) + '" width="3" height="' + (rowH - 6) + '" fill="' + COLOR.peak + '" rx="1.5"/>';
      }
      svg += '<text x="10" y="' + (y + 14) + '" font-size="11" font-weight="500" fill="' + (isTop ? COLOR.peak : P.text) + '">' +
        U.esc(truncate(d.label, 13)) + '</text>';
      svg += '<text x="' + (left - 10) + '" y="' + (y + 14) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.esc(d.meta || '') + '</text>';
      svg += '<rect x="' + left + '" y="' + (y + 4) + '" width="' + barW.toFixed(1) + '" height="' + (rowH - 14) +
        '" rx="3" fill="' + color + '" opacity="' + (isTop ? '1' : '.82') + '"/>';
      svg += '<text x="' + (width - 8) + '" y="' + (y + 15) + '" text-anchor="end" font-size="11" font-weight="600" fill="' +
        (isTop ? COLOR.peak : P.text) + '" style="font-variant-numeric:tabular-nums">' + U.fmt(d.value, 2) + '</text>';
      svg += '</g>';
    });

    if (opts.refLine != null) {
      const xx = x(opts.refLine);
      if (xx >= left && xx <= left + plotW) {
        svg += '<line x1="' + xx.toFixed(1) + '" y1="' + (top - 4) + '" x2="' + xx.toFixed(1) + '" y2="' + (height - 10) +
          '" stroke="' + P.muted + '" stroke-width="1" stroke-dasharray="3 3" opacity=".7"/>';
        svg += '<text x="' + (xx + 4) + '" y="' + (height - 2) + '" font-size="9" fill="' + P.muted + '">' +
          U.esc(opts.refLabel || '参考线') + ' ' + U.fmt(opts.refLine, 2) + '</text>';
      }
    }
    svg += '</svg>';
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* 散点图：成本 × 精力收益 × 精力                                      */
  /* ------------------------------------------------------------------ */
  function scatter(rows, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const width = 760, height = 360;
    const ml = 58, mr = 18, mt = 18, mb = 42;
    const data = rows.filter(function (r) {
      return !r.calc.missing && r.calc.perEnergy != null && r.calc.totalCost >= 0;
    });
    if (!data.length) return emptyChart(width, height, '当前筛选无完整数据', P);

    const xs = data.map(function (r) { return r.calc.totalCost; });
    const ys = data.map(function (r) { return r.calc.perEnergy; });
    const xMax = niceMax(Math.max.apply(null, xs) * 1.05 || 1);
    const yMax = niceMax(Math.max.apply(null, ys.concat([0])) * 1.08);
    const yMin = Math.min(0, Math.min.apply(null, ys) * 1.2);
    const plotW = width - ml - mr;
    const plotH = height - mt - mb;
    const x = function (v) { return ml + (v / xMax) * plotW; };
    const y = function (v) { return mt + plotH - ((v - yMin) / (yMax - yMin)) * plotH; };
    const maxEnergy = Math.max.apply(null, data.map(function (r) { return r.calc.energy || 1; }));
    const rOf = function (e) { return 3.5 + Math.sqrt((e || 1) / maxEnergy) * 7; };

    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
      attr(opts.ariaLabel || '成本与精力收益散点图') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';

    const yTicks = ticks(yMax - yMin, 4).map(function (t) { return yMin + t; });
    yTicks.forEach(function (t) {
      const yy = y(t);
      svg += '<line x1="' + ml + '" y1="' + yy.toFixed(1) + '" x2="' + (width - mr) + '" y2="' + yy.toFixed(1) +
        '" stroke="' + (Math.abs(t) < 1e-9 ? P.axis : P.grid) + '" stroke-width="1"/>';
      svg += '<text x="' + (ml - 8) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.fmt(t, 1) + '</text>';
    });
    const xTicks = ticks(xMax, 4);
    xTicks.forEach(function (t) {
      const xx = x(t);
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + mt + '" x2="' + xx.toFixed(1) + '" y2="' + (height - mb) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + xx.toFixed(1) + '" y="' + (height - mb + 16) + '" text-anchor="middle" font-size="10" fill="' + P.muted + '">' +
        U.fmt(t, 0) + '</text>';
    });
    svg += '<text x="' + (width - mr) + '" y="' + (height - 8) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">单次成本（金）</text>';
    svg += '<text x="' + ml + '" y="' + (mt + 8) + '" font-size="10" fill="' + P.muted + '">精力收益（金/精力）</text>';

    const sorted = data.slice().sort(function (a, b) { return b.calc.perEnergy - a.calc.perEnergy; });
    const topIds = new Set(sorted.slice(0, 3).map(function (r) { return r.recipe.id; }));

    data.forEach(function (r) {
      const cx = x(r.calc.totalCost);
      const cy = y(r.calc.perEnergy);
      const isTop = topIds.has(r.recipe.id);
      const color = isTop ? COLOR.peak : (r.type === 'gather' ? COLOR.gather : COLOR.craft);
      const rad = rOf(r.calc.energy);
      const tip = r.recipe.name + ' · ' + U.fmt(r.calc.totalCost, 2) + ' 金成本 · ' +
        U.fmt(r.calc.perEnergy, 2) + ' 金/精力 · ' + U.fmtInt(r.calc.energy) + ' 精力';
      svg += '<circle class="chart-point" tabindex="0" data-tip="' + attr(tip) + '" data-recipe="' + attr(r.recipe.id) + '"' +
        ' cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rad.toFixed(1) + '" fill="' + color +
        '" fill-opacity="' + (isTop ? '.95' : '.66') + '" stroke="' + (isTop ? color : 'transparent') +
        '" stroke-width="' + (isTop ? '2' : '0') + '" aria-label="' + attr(tip) + '"/>';
    });
    svg += '</svg>';
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* 箱线图：各技艺精力收益分布                                          */
  /* ------------------------------------------------------------------ */
  function boxPlot(rows, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const width = 760;
    const rowH = 38;
    const mt = 22, ml = 78, mr = 24, mb = 26;
    const groups = opts.groups || [];
    const values = [];
    groups.forEach(function (g) { g.values.forEach(function (v) { values.push(v); }); });
    if (!values.length) return emptyChart(width, 260, '当前筛选无完整数据', P);

    const minV = Math.min(0, Math.min.apply(null, values));
    const maxV = Math.max.apply(null, values);
    const span = maxV - minV || 1;
    const lo = minV - span * 0.08;
    const hi = maxV + span * 0.08;
    const height = mt + groups.length * rowH + mb;
    const plotW = width - ml - mr;
    const x = function (v) { return ml + ((v - lo) / (hi - lo)) * plotW; };

    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
      attr(opts.ariaLabel || '各技艺精力收益分布') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';

    const ticksArr = 4;
    for (let i = 0; i <= ticksArr; i++) {
      const v = lo + (hi - lo) * (i / ticksArr);
      const xx = x(v);
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + mt + '" x2="' + xx.toFixed(1) + '" y2="' + (height - mb) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + xx.toFixed(1) + '" y="' + (height - 8) + '" text-anchor="middle" font-size="10" fill="' + P.muted + '">' +
        U.fmt(v, 1) + '</text>';
    }

    groups.forEach(function (g, i) {
      const cy = mt + i * rowH + rowH / 2;
      const color = g.type === 'gather' ? COLOR.gather : COLOR.craft;
      const vals = g.values.slice().sort(function (a, b) { return a - b; });
      const q = function (p) {
        const pos = (vals.length - 1) * p;
        const base = Math.floor(pos), rest = pos - base;
        return vals[base + 1] !== undefined ? vals[base] + rest * (vals[base + 1] - vals[base]) : vals[base];
      };
      const median = q(0.5), q1 = q(0.25), q3 = q(0.75);
      const iqr = q3 - q1;
      const lowW = Math.max(vals[0], q1 - iqr * 1.5);
      const highW = Math.min(vals[vals.length - 1], q3 + iqr * 1.5);
      const tip = g.name + '：中位 ' + U.fmt(median, 2) + '，Q1 ' + U.fmt(q1, 2) + '，Q3 ' + U.fmt(q3, 2) + '（' + vals.length + ' 个配方）';
      svg += '<g class="chart-box" tabindex="0" data-tip="' + attr(tip) + '" aria-label="' + attr(tip) + '">';
      svg += '<text x="' + (ml - 12) + '" y="' + (cy + 4) + '" text-anchor="end" font-size="11" fill="' + P.text + '">' + U.esc(g.name) + '</text>';
      svg += '<line x1="' + x(lowW).toFixed(1) + '" y1="' + cy + '" x2="' + x(highW).toFixed(1) + '" y2="' + cy + '" stroke="' + color + '" stroke-width="1.5" opacity=".7"/>';
      svg += '<line x1="' + x(lowW).toFixed(1) + '" y1="' + (cy - 5) + '" x2="' + x(lowW).toFixed(1) + '" y2="' + (cy + 5) + '" stroke="' + color + '" stroke-width="1.5" opacity=".7"/>';
      svg += '<line x1="' + x(highW).toFixed(1) + '" y1="' + (cy - 5) + '" x2="' + x(highW).toFixed(1) + '" y2="' + (cy + 5) + '" stroke="' + color + '" stroke-width="1.5" opacity=".7"/>';
      svg += '<rect x="' + x(q1).toFixed(1) + '" y="' + (cy - 8) + '" width="' + Math.max(2, x(q3) - x(q1)).toFixed(1) +
        '" height="16" rx="3" fill="' + color + '" fill-opacity=".28" stroke="' + color + '" stroke-width="1.2"/>';
      svg += '<line x1="' + x(median).toFixed(1) + '" y1="' + (cy - 8) + '" x2="' + x(median).toFixed(1) + '" y2="' + (cy + 8) +
        '" stroke="' + P.bg + '" stroke-width="3"/>';
      svg += '<line x1="' + x(median).toFixed(1) + '" y1="' + (cy - 8) + '" x2="' + x(median).toFixed(1) + '" y2="' + (cy + 8) +
        '" stroke="' + color + '" stroke-width="1.5"/>';
      vals.forEach(function (v) {
        if (v < lowW || v > highW) {
          svg += '<circle cx="' + x(v).toFixed(1) + '" cy="' + cy + '" r="2.4" fill="' + color + '" fill-opacity=".8"/>';
        }
      });
      svg += '</g>';
    });

    svg += '<line x1="' + x(0).toFixed(1) + '" y1="' + mt + '" x2="' + x(0).toFixed(1) + '" y2="' + (height - mb) +
      '" stroke="' + P.muted + '" stroke-width="1" stroke-dasharray="4 3" opacity=".7"/>';
    svg += '</svg>';
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* 分组柱状：采集 vs 制造                                              */
  /* ------------------------------------------------------------------ */
  function diffBar(a, b, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const width = 380, height = 150;
    const ml = 68, mr = 20, mt = 20, mb = 24;
    const max = niceMax(Math.max(a.value, b.value, 0.001) * 1.12);
    const plotW = width - ml - mr;
    const x = function (v) { return ml + (Math.max(0, v) / max) * plotW; };
    const rows = [
      { label: a.label, value: a.value, color: opts.aColor || COLOR.gather, type: 'gather' },
      { label: b.label, value: b.value, color: opts.bColor || COLOR.craft, type: 'craft' }
    ];
    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
      attr(opts.ariaLabel || '采集与制造精力收益对比') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';
    for (let i = 0; i <= 3; i++) {
      const xx = x((max / 3) * i);
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + mt + '" x2="' + xx.toFixed(1) + '" y2="' + (height - mb) +
        '" stroke="' + P.grid + '"/>';
    }
    rows.forEach(function (r, i) {
      const y = mt + i * 46;
      const tip = r.label + '：平均 ' + U.fmt(r.value, 2) + ' 金/精力';
      svg += '<g data-tip="' + attr(tip) + '" tabindex="0" aria-label="' + attr(tip) + '">';
      svg += '<text x="' + (ml - 10) + '" y="' + (y + 20) + '" text-anchor="end" font-size="11" fill="' + P.text + '">' + U.esc(r.label) + '</text>';
      svg += '<rect x="' + ml + '" y="' + (y + 8) + '" width="' + Math.max(2, x(r.value) - ml).toFixed(1) + '" height="20" rx="3" fill="' + r.color + '" fill-opacity=".85"/>';
      svg += '<text x="' + (width - 6) + '" y="' + (y + 23) + '" text-anchor="end" font-size="11" font-weight="600" fill="' + P.text + '">' + U.fmt(r.value, 2) + '</text>';
      svg += '</g>';
    });
    svg += '</svg>';
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* 分组柱状：支持正负值（五行石快速 vs 最优）                          */
  /* ------------------------------------------------------------------ */
  function columns(items, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const width = opts.width || 760;
    const height = opts.height || 300;
    const ml = 54, mr = 18, mt = 24, mb = 58;
    const data = (items || []).filter(function (d) { return d && Number.isFinite(Number(d.value)); });
    if (!data.length) return emptyChart(width, height, opts.emptyText || '当前没有可对比的数据', P);
    const values = data.map(function (d) { return Number(d.value); });
    const maxV = Math.max.apply(null, values.concat([0]));
    const minV = Math.min.apply(null, values.concat([0]));
    const span = (maxV - minV) || 1;
    const plotW = width - ml - mr;
    const plotH = height - mt - mb;
    const y = function (v) { return mt + plotH - ((v - minV) / span) * plotH; };
    const zeroY = y(0);
    const slot = plotW / data.length;
    const barW = Math.max(14, Math.min(42, slot * 0.52));
    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
      attr(opts.ariaLabel || '五行石合成方式对比') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';
    const tickCount = 4;
    for (let i = 0; i <= tickCount; i++) {
      const v = minV + span * i / tickCount;
      const yy = y(v);
      svg += '<line x1="' + ml + '" y1="' + yy.toFixed(1) + '" x2="' + (width - mr) + '" y2="' + yy.toFixed(1) +
        '" stroke="' + (Math.abs(v) < 1e-9 ? P.axis : P.grid) + '" stroke-width="1"/>';
      svg += '<text x="' + (ml - 8) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.fmt(v, Math.abs(v) < 10 ? 2 : 0) + '</text>';
    }
    if (opts.unit) {
      svg += '<text x="' + ml + '" y="' + (mt - 8) + '" font-size="10" fill="' + P.muted + '">' + U.esc(opts.unit) + '</text>';
    }
    data.forEach(function (d, i) {
      const v = Number(d.value);
      const cx = ml + slot * (i + 0.5);
      const top = y(Math.max(0, v));
      const bottom = y(Math.min(0, v));
      const h = Math.max(2, Math.abs(bottom - top));
      const color = d.color || COLOR.craft;
      const tip = (d.tip || d.label) + '：' + U.fmt(v, 2) + (opts.unit ? ' ' + opts.unit : '');
      svg += '<g class="chart-column" tabindex="0" data-tip="' + attr(tip) + '" aria-label="' + attr(tip) + '">';
      svg += '<rect x="' + (cx - barW / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + barW.toFixed(1) +
        '" height="' + h.toFixed(1) + '" rx="3" fill="' + color + '" fill-opacity=".86"/>';
      svg += '<text x="' + cx.toFixed(1) + '" y="' + (v >= 0 ? top - 6 : top + 12).toFixed(1) +
        '" text-anchor="middle" font-size="10" font-weight="600" fill="' + (v >= 0 ? P.text : COLOR.danger) + '">' +
        U.fmt(v, 2) + '</text>';
      const label = d.label || '';
      svg += '<text x="' + cx.toFixed(1) + '" y="' + (height - mb + 18) + '" text-anchor="middle" font-size="10" fill="' + P.muted + '">' +
        U.esc(truncate(label, opts.labelWidth || 12)) + '</text>';
      if (d.meta) {
        svg += '<text x="' + cx.toFixed(1) + '" y="' + (height - mb + 33) + '" text-anchor="middle" font-size="9" fill="' + P.muted + '">' +
          U.esc(truncate(d.meta, 14)) + '</text>';
      }
      svg += '</g>';
    });
    svg += '</svg>';
    return svg;
  }


  /* ------------------------------------------------------------------ */
  /* 蜡烛图：单个物品在历史节点上的开盘/收盘/高/低                        */
  /* ------------------------------------------------------------------ */
  function candle(candles, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const width = opts.width || 920;
    const height = opts.height || 380;
    const ml = 64, mr = 22, mt = 26, mb = 48;
    const data = (candles || []).filter(function (d) {
      return d && Number.isFinite(Number(d.open)) && Number.isFinite(Number(d.close));
    });
    if (!data.length) return emptyChart(width, height, opts.emptyText || '当前范围内没有足够的价格节点', P);

    const vals = [];
    data.forEach(function (d) {
      vals.push(Number(d.low), Number(d.high), Number(d.open), Number(d.close));
    });
    let lo = Math.min.apply(null, vals);
    let hi = Math.max.apply(null, vals);
    if (!(hi > lo)) { hi = lo + Math.max(1, Math.abs(lo) * 0.04); lo = Math.max(0, lo - Math.max(1, Math.abs(lo) * 0.04)); }
    const pad = (hi - lo) * 0.08;
    lo = Math.max(0, lo - pad);
    hi += pad;
    const plotW = width - ml - mr;
    const plotH = height - mt - mb;
    const y = function (v) { return mt + plotH - ((v - lo) / (hi - lo)) * plotH; };

    let t0 = Date.parse(data[0].at);
    let t1 = Date.parse(data[data.length - 1].at);
    if (!Number.isFinite(t0)) t0 = 0;
    if (!Number.isFinite(t1)) t1 = t0 + 3600000;
    if (t1 <= t0) t1 = t0 + 3600000;
    const span = t1 - t0;
    const x = function (at) {
      const t = Date.parse(at);
      return ml + ((Number.isFinite(t) ? t : t0) - (t0 - span * 0.04)) / (span * 1.08) * plotW;
    };
    const bodyW = Math.max(3, Math.min(18, plotW / Math.max(data.length, 1) * 0.44));

    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
      attr(opts.ariaLabel || '历史物价蜡烛图') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';

    for (let i = 0; i <= 4; i++) {
      const v = lo + (hi - lo) * i / 4;
      const yy = y(v);
      svg += '<line x1="' + ml + '" y1="' + yy.toFixed(1) + '" x2="' + (width - mr) + '" y2="' + yy.toFixed(1) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + (ml - 8) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.esc(U.fmt(v, v < 10 ? 2 : v < 1000 ? 1 : 0)) + '</text>';
    }
    svg += '<text x="' + ml + '" y="' + (mt - 8) + '" font-size="10" fill="' + P.muted + '">单价（金）</text>';

    const labelCount = Math.min(6, data.length);
    const labelIndexes = [];
    for (let i = 0; i < labelCount; i++) {
      labelIndexes.push(Math.round(i * (data.length - 1) / Math.max(1, labelCount - 1)));
    }
    const multiDay = data[0].date !== data[data.length - 1].date;
    labelIndexes.forEach(function (idx) {
      const d = data[idx];
      const xx = x(d.at);
      const text = multiDay ? String(d.date).slice(5) : String(d.at || '').slice(11, 16);
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + mt + '" x2="' + xx.toFixed(1) + '" y2="' + (height - mb) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + xx.toFixed(1) + '" y="' + (height - mb + 16) + '" text-anchor="middle" font-size="10" fill="' + P.muted + '">' +
        U.esc(text) + '</text>';
    });

    const points = data.map(function (d) { return [x(d.at), y(d.close)]; });
    svg += '<polyline fill="none" stroke="' + P.muted + '" stroke-width="1" opacity=".35" points="' +
      points.map(function (pt) { return pt[0].toFixed(1) + ',' + pt[1].toFixed(1); }).join(' ') + '"/>';

    data.forEach(function (d) {
      const open = Number(d.open), close = Number(d.close), high = Number(d.high), low = Number(d.low);
      const up = close >= open;
      const color = close === open ? P.muted : (up ? COLOR.gather : COLOR.danger);
      const xx = x(d.at);
      const top = y(Math.max(open, close));
      const bottom = y(Math.min(open, close));
      const bodyH = Math.max(1.5, bottom - top);
      const change = open > 0 ? (close / open - 1) * 100 : 0;
      const tip = String(d.at || '').replace('T', ' ') + ' · 开 ' + U.fmt(open, 2) + ' / 收 ' + U.fmt(close, 2) +
        ' / 高 ' + U.fmt(high, 2) + ' / 低 ' + U.fmt(low, 2) + ' · ' + (change >= 0 ? '+' : '') + U.fmt(change, 2) + '%';
      svg += '<g class="chart-candle" tabindex="0" data-tip="' + attr(tip) + '" aria-label="' + attr(tip) + '">';
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + y(high).toFixed(1) + '" x2="' + xx.toFixed(1) + '" y2="' + y(low).toFixed(1) +
        '" stroke="' + color + '" stroke-width="1.2" opacity=".9"/>';
      svg += '<rect x="' + (xx - bodyW / 2).toFixed(1) + '" y="' + top.toFixed(1) + '" width="' + bodyW.toFixed(1) +
        '" height="' + bodyH.toFixed(1) + '" rx="1.5" fill="' + color + '" fill-opacity=".9"/>';
      svg += '</g>';
    });
    svg += '</svg>';
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* 物价散点：时间 × 价格 / 区间涨跌幅                                   */
  /* ------------------------------------------------------------------ */
  function trendScatter(rows, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const width = opts.width || 920;
    const height = opts.height || 380;
    const ml = 64, mr = 22, mt = 26, mb = 48;
    const metric = opts.metric === 'change' ? 'change' : 'price';
    const data = (rows || []).filter(function (r) {
      if (!r) return false;
      if (metric === 'change') return Number.isFinite(Number(r.change));
      return Number.isFinite(Number(r.price)) && Number(r.price) > 0;
    });
    if (!data.length) return emptyChart(width, height, opts.emptyText || '当前筛选无价格节点', P);

    const plotW = width - ml - mr;
    const plotH = height - mt - mb;
    const times = data.map(function (r) { return Date.parse(r.at); }).filter(function (t) { return Number.isFinite(t); });
    let t0 = times.length ? Math.min.apply(null, times) : 0;
    let t1 = times.length ? Math.max.apply(null, times) : t0 + 3600000;
    if (t1 <= t0) t1 = t0 + 3600000;
    const span = t1 - t0;
    const x = function (at) {
      const t = Date.parse(at);
      return ml + ((Number.isFinite(t) ? t : t0) - (t0 - span * 0.04)) / (span * 1.08) * plotW;
    };

    let yMin, yMax, y, ticks = [];
    const useLog = metric === 'price' && opts.log !== false;
    if (metric === 'price' && useLog) {
      const vals = data.map(function (r) { return Number(r.price); });
      const logMin = Math.log10(Math.min.apply(null, vals));
      const logMax = Math.log10(Math.max.apply(null, vals));
      const pad = Math.max(0.08, (logMax - logMin) * 0.08);
      const lo = logMin - pad;
      const hi = logMax + pad;
      y = function (v) { return mt + plotH - ((Math.log10(v) - lo) / (hi - lo)) * plotH; };
      const step = (hi - lo) / 4;
      for (let i = 0; i <= 4; i++) {
        const v = Math.pow(10, lo + step * i);
        ticks.push(v);
      }
    } else if (metric === 'price') {
      const vals = data.map(function (r) { return Number(r.price); });
      yMin = Math.min.apply(null, vals);
      yMax = Math.max.apply(null, vals);
      if (!(yMax > yMin)) {
        const base = Math.max(1, Math.abs(yMin) * 0.04);
        yMin = Math.max(0, yMin - base);
        yMax += base;
      }
      const pad = (yMax - yMin) * 0.1;
      yMin = Math.max(0, yMin - pad);
      yMax += pad;
      y = function (v) { return mt + plotH - ((v - yMin) / (yMax - yMin)) * plotH; };
      for (let i = 0; i <= 4; i++) ticks.push(yMin + (yMax - yMin) * i / 4);
    } else {
      const vals = data.map(function (r) { return Number(r.change); }).concat([0]);
      yMin = Math.min.apply(null, vals);
      yMax = Math.max.apply(null, vals);
      if (!(yMax > yMin)) { yMax = yMin + 1; }
      const pad = (yMax - yMin) * 0.1;
      yMin -= pad; yMax += pad;
      y = function (v) { return mt + plotH - ((v - yMin) / (yMax - yMin)) * plotH; };
      for (let i = 0; i <= 4; i++) ticks.push(yMin + (yMax - yMin) * i / 4);
    }

    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" role="img" aria-label="' +
      attr(opts.ariaLabel || '历史物价散点图') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';

    ticks.forEach(function (v) {
      const yy = y(v);
      const zero = metric === 'change' && Math.abs(v) < 1e-9;
      svg += '<line x1="' + ml + '" y1="' + yy.toFixed(1) + '" x2="' + (width - mr) + '" y2="' + yy.toFixed(1) +
        '" stroke="' + (zero ? P.axis : P.grid) + '" stroke-width="1"/>';
      const label = metric === 'change' ? ((v > 0 ? '+' : '') + U.fmt(v, 1) + '%') : U.fmt(v, v < 1 ? 2 : v < 100 ? 1 : 0);
      svg += '<text x="' + (ml - 8) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.esc(label) + '</text>';
    });
    svg += '<text x="' + ml + '" y="' + (mt - 8) + '" font-size="10" fill="' + P.muted + '">' +
      (metric === 'change' ? '区间涨跌幅' : (useLog ? '单价（金 · 对数）' : '单价（金）')) + '</text>';

    const labelTimes = Array.isArray(opts.labelTimes) && opts.labelTimes.length ? opts.labelTimes : null;
    const labelCount = labelTimes ? labelTimes.length : 5;
    for (let i = 0; i < labelCount; i++) {
      const t = labelTimes ? Date.parse(labelTimes[i]) : t0 + span * i / (labelCount - 1);
      const xx = labelTimes ? x(labelTimes[i]) : ml + (t - (t0 - span * 0.04)) / (span * 1.08) * plotW;
      const d = new Date(t);
      const text = (d.getMonth() + 1) + '-' + String(d.getDate()).padStart(2, '0') + ' ' +
        String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + mt + '" x2="' + xx.toFixed(1) + '" y2="' + (height - mb) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + xx.toFixed(1) + '" y="' + (height - mb + 16) + '" text-anchor="middle" font-size="10" fill="' + P.muted + '">' +
        U.esc(text) + '</text>';
    }

    data.forEach(function (r) {
      const price = Number(r.price);
      const value = metric === 'change' ? Number(r.change) : price;
      const cx = x(r.at);
      const cy = y(value);
      const rad = r.highlight ? 5.4 : 3.1;
      const color = r.color || COLOR.craft;
      const tip = r.name + ' · ' + (r.tierName || r.skillName) + ' · ' + String(r.at || '').replace('T', ' ') +
        ' · ' + U.fmt(price, 2) + ' 金' +
        (Number.isFinite(Number(r.change)) ? ' · ' + (r.change >= 0 ? '+' : '') + U.fmt(r.change, 2) + '%' : '');
      svg += '<circle class="chart-point" tabindex="0" data-tip="' + attr(tip) + '"' +
        ' cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + rad + '" fill="' + color +
        '" fill-opacity="' + (r.highlight ? '.98' : '.66') + '"' +
        (r.highlight ? ' stroke="' + P.text + '" stroke-width="1.6"' : ' stroke="transparent" stroke-width="0"') +
        ' aria-label="' + attr(tip) + '"/>';
    });
    svg += '</svg>';
    return svg;
  }


  /* ------------------------------------------------------------------ */
  /* 价格分布：最低/最高/平均值 + 10/25/50/75/90 分位                     */
  /* ------------------------------------------------------------------ */
  function priceDistribution(items, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const data = (items || []).filter(function (item) { return item && item.stats; });
    if (!data.length) return emptyChart(opts.width || 1000, opts.height || 360, opts.emptyText || '当前筛选没有可统计的价格', P);
    const width = opts.width || Math.max(1000, data.length * 64);
    const height = opts.height || 360;
    const ml = 64, mr = 22, mt = 22, mb = 100;
    const plotW = width - ml - mr;
    const plotH = height - mt - mb;
    const values = [];
    data.forEach(function (item) { values.push(item.stats.min, item.stats.max); });
    const positive = values.filter(function (v) { return v > 0; });
    if (!positive.length) return emptyChart(width, height, opts.emptyText || '当前筛选没有可统计的价格', P);
    const useLog = opts.log !== false;
    let y, ticks = [];
    if (useLog) {
      const lo = Math.log10(Math.min.apply(null, positive));
      const hi = Math.log10(Math.max.apply(null, positive));
      const pad = Math.max(0.08, (hi - lo) * 0.08);
      const bottom = lo - pad;
      const top = hi + pad;
      y = function (v) { return mt + plotH - ((Math.log10(Math.max(v, 1e-9)) - bottom) / (top - bottom)) * plotH; };
      for (let i = 0; i <= 4; i++) ticks.push(Math.pow(10, bottom + (top - bottom) * i / 4));
    } else {
      let minV = Math.min.apply(null, values), maxV = Math.max.apply(null, values);
      if (!(maxV > minV)) maxV = minV + Math.max(1, Math.abs(minV) * 0.04);
      const pad = (maxV - minV) * 0.1;
      minV = Math.max(0, minV - pad); maxV += pad;
      y = function (v) { return mt + plotH - ((v - minV) / (maxV - minV)) * plotH; };
      for (let i = 0; i <= 4; i++) ticks.push(minV + (maxV - minV) * i / 4);
    }
    const slot = plotW / data.length;
    const cx = function (i) { return ml + slot * (i + 0.5); };

    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" style="width:' + width + 'px;max-width:none" role="img" aria-label="' +
      attr(opts.ariaLabel || '价格分布') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';

    if (opts.focusKey) {
      data.forEach(function (item, i) {
        if (!item.focus) return;
        svg += '<rect x="' + (ml + slot * i).toFixed(1) + '" y="' + mt + '" width="' + slot.toFixed(1) + '" height="' + plotH +
          '" fill="' + P.text + '" fill-opacity=".045"/>';
      });
    }
    ticks.forEach(function (v) {
      const yy = y(v);
      svg += '<line x1="' + ml + '" y1="' + yy.toFixed(1) + '" x2="' + (width - mr) + '" y2="' + yy.toFixed(1) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      const label = v < 1 ? U.fmt(v, 2) : v < 100 ? U.fmt(v, 1) : U.fmt(v, 0);
      svg += '<text x="' + (ml - 8) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.esc(label) + '</text>';
    });
    svg += '<text x="' + ml + '" y="' + (mt - 7) + '" font-size="10" fill="' + P.muted + '">' +
      U.esc(opts.axisLabel || (useLog ? '单价（金 · 对数）' : '单价（金）')) + '</text>';

    data.forEach(function (item, i) {
      const s = item.stats;
      const color = item.color || opts.color || COLOR.craft;
      const x = cx(i);
      const tip = item.name + ' · ' + s.count + ' 个节点\n' +
        '最低  ' + U.fmt(s.min, 2) + '\n' +
        '最高  ' + U.fmt(s.max, 2) + '\n' +
        '平均  ' + U.fmt(s.avg, 2) + '\n' +
        '10%  ' + U.fmt(s.p10, 2) + '\n' +
        '25%  ' + U.fmt(s.p25, 2) + '\n' +
        '50%  ' + U.fmt(s.p50, 2) + '\n' +
        '75%  ' + U.fmt(s.p75, 2) + '\n' +
        '90%  ' + U.fmt(s.p90, 2);
      svg += '<g class="chart-dist" tabindex="0" data-trend-focus="' + attr(item.key) + '" data-tip="' + attr(tip) +
        '" aria-label="' + attr(tip) + '">';
      const yMin = y(s.min), yMax = y(s.max);
      const y25 = y(s.p25), y75 = y(s.p75), y50 = y(s.p50);
      svg += '<line x1="' + x.toFixed(1) + '" y1="' + yMin.toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + yMax.toFixed(1) +
        '" stroke="' + color + '" stroke-width="1.4" opacity=".8"/>';
      svg += '<line x1="' + (x - 4).toFixed(1) + '" y1="' + yMin.toFixed(1) + '" x2="' + (x + 4).toFixed(1) + '" y2="' + yMin.toFixed(1) +
        '" stroke="' + color + '" stroke-width="1.4"/>';
      svg += '<line x1="' + (x - 4).toFixed(1) + '" y1="' + yMax.toFixed(1) + '" x2="' + (x + 4).toFixed(1) + '" y2="' + yMax.toFixed(1) +
        '" stroke="' + color + '" stroke-width="1.4"/>';
      const boxW = Math.max(4, slot * 0.26);
      const rawTop = Math.min(y25, y75);
      const rawH = Math.abs(y75 - y25);
      const boxH = Math.max(4, rawH);
      const boxTop = rawTop - (boxH - rawH) / 2;
      svg += '<rect x="' + (x - boxW).toFixed(1) + '" y="' + boxTop.toFixed(1) + '" width="' + (boxW * 2).toFixed(1) +
        '" height="' + boxH.toFixed(1) + '" fill="' + color + '" stroke="' + color + '" stroke-width="1"/>';
      svg += '<line x1="' + (x - boxW).toFixed(1) + '" y1="' + y50.toFixed(1) + '" x2="' + (x + boxW).toFixed(1) + '" y2="' + y50.toFixed(1) +
        '" stroke="' + P.text + '" stroke-width="1.8"/>';
      svg += '</g>';
    });

    data.forEach(function (item, i) {
      const x = cx(i);
      const label = truncate(item.name, 12);
      const focus = opts.focusKey === item.key;
      const color = item.color || COLOR.craft;
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + (height - mb - 5) + '" r="2.6" fill="' + color + '" data-trend-focus="' + attr(item.key) + '" style="cursor:pointer"/>';
      svg += '<text x="' + x.toFixed(1) + '" y="' + (height - mb + 14) + '" transform="rotate(-45 ' + x.toFixed(1) + ' ' + (height - mb + 14) + ')" text-anchor="end" font-size="10" font-weight="' + (focus ? '600' : '400') + '" fill="' + (focus ? P.text : P.muted) + '" data-trend-focus="' + attr(item.key) + '" style="cursor:pointer">' +
        U.esc(label) + '</text>';
    });
    svg += '</svg>';
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* 类别散点：x=物品，y=价格，按节点做水平抖动                            */
  /* ------------------------------------------------------------------ */
  function categoryScatter(rows, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const items = opts.items || [];
    const data = (rows || []).filter(function (r) { return r && Number(r.price) > 0; });
    if (!data.length || !items.length) return emptyChart(opts.width || 1000, opts.height || 300, opts.emptyText || '当前筛选没有价格节点', P);
    const width = opts.width || Math.max(1000, items.length * 64);
    const height = opts.height || 300;
    const ml = 64, mr = 22, mt = 22, mb = 90;
    const plotW = width - ml - mr;
    const plotH = height - mt - mb;
    const values = data.map(function (r) { return r.price; });
    const useLog = opts.log !== false;
    let y, ticks = [];
    if (useLog) {
      const lo = Math.log10(Math.min.apply(null, values));
      const hi = Math.log10(Math.max.apply(null, values));
      const pad = Math.max(0.08, (hi - lo) * 0.08);
      const bottom = lo - pad, top = hi + pad;
      y = function (v) { return mt + plotH - ((Math.log10(v) - bottom) / (top - bottom)) * plotH; };
      for (let i = 0; i <= 4; i++) ticks.push(Math.pow(10, bottom + (top - bottom) * i / 4));
    } else {
      let minV = Math.min.apply(null, values), maxV = Math.max.apply(null, values);
      if (!(maxV > minV)) maxV = minV + Math.max(1, Math.abs(minV) * 0.04);
      const pad = (maxV - minV) * 0.1;
      minV = Math.max(0, minV - pad); maxV += pad;
      y = function (v) { return mt + plotH - ((v - minV) / (maxV - minV)) * plotH; };
      for (let i = 0; i <= 4; i++) ticks.push(minV + (maxV - minV) * i / 4);
    }
    const slot = plotW / items.length;
    const cx = function (i) { return ml + slot * (i + 0.5); };
    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" style="width:' + width + 'px;max-width:none" role="img" aria-label="' +
      attr(opts.ariaLabel || '价格散点') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';
    if (opts.focusKey) {
      items.forEach(function (item, i) {
        if (!item.focus) return;
        svg += '<rect x="' + (ml + slot * i).toFixed(1) + '" y="' + mt + '" width="' + slot.toFixed(1) + '" height="' + plotH +
          '" fill="' + P.text + '" fill-opacity=".045"/>';
      });
    }
    ticks.forEach(function (v) {
      const yy = y(v);
      svg += '<line x1="' + ml + '" y1="' + yy.toFixed(1) + '" x2="' + (width - mr) + '" y2="' + yy.toFixed(1) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      const label = v < 1 ? U.fmt(v, 2) : v < 100 ? U.fmt(v, 1) : U.fmt(v, 0);
      svg += '<text x="' + (ml - 8) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.esc(label) + '</text>';
    });
    svg += '<text x="' + ml + '" y="' + (mt - 7) + '" font-size="10" fill="' + P.muted + '">' +
      U.esc(opts.axisLabel || (useLog ? '单价（金 · 对数）' : '单价（金）')) + '</text>';
    data.forEach(function (r) {
      const item = items[r.itemIndex];
      if (!item) return;
      const x = cx(r.itemIndex) + (r.jitter || 0) * slot * 0.44;
      const yy = y(r.price);
      const shown = U.fmt(r.price, 1) + (r.rawPrice != null && Math.abs(Number(r.rawPrice) - Number(r.price)) > 1e-9
        ? '（' + U.fmt(r.rawPrice, 2) + ' 金）' : (opts.axisLabel && opts.axisLabel.indexOf('指数') !== -1 ? ' 指数' : ' 金'));
      const tip = r.name + ' · ' + String(r.at || '').replace('T', ' ') + ' · ' + shown +
        (Number.isFinite(Number(r.change)) ? ' · ' + (r.change >= 0 ? '+' : '') + U.fmt(r.change, 2) + '%' : '');
      svg += '<circle class="chart-point" tabindex="0" cx="' + x.toFixed(1) + '" cy="' + yy.toFixed(1) + '" r="' +
        (r.focus ? 4.6 : 3.2) + '" fill="' + (r.color || item.tierColor || COLOR.craft) + '" fill-opacity=".9"' +
        (r.focus ? ' stroke="' + P.text + '" stroke-width="1.5"' : ' stroke="transparent" stroke-width="0"') +
        ' data-trend-focus="' + attr(r.itemKey) + '" data-tip="' + attr(tip) + '" aria-label="' + attr(tip) + '"/>';
    });
    items.forEach(function (item, i) {
      const x = cx(i);
      const label = truncate(item.name, 12);
      const focus = opts.focusKey === item.key;
      const color = item.color || COLOR.craft;
      svg += '<circle cx="' + x.toFixed(1) + '" cy="' + (height - mb - 5) + '" r="2.6" fill="' + color + '" data-trend-focus="' + attr(item.key) + '" style="cursor:pointer"/>';
      svg += '<text x="' + x.toFixed(1) + '" y="' + (height - mb + 14) + '" transform="rotate(-45 ' + x.toFixed(1) + ' ' + (height - mb + 14) + ')" text-anchor="end" font-size="10" font-weight="' + (focus ? '600' : '400') + '" fill="' + (focus ? P.text : P.muted) + '" data-trend-focus="' + attr(item.key) + '" style="cursor:pointer">' +
        U.esc(label) + '</text>';
    });
    svg += '</svg>';
    return svg;
  }

  /* ------------------------------------------------------------------ */
  /* 单物品折线：时间 × 价格                                             */
  /* ------------------------------------------------------------------ */
  function priceLine(series, opts) {
    opts = opts || {};
    const P = opts.palette || DARK;
    const data = (series || []).filter(function (point) { return Number(point.price) > 0; });
    if (!data.length) return emptyChart(opts.width || 1000, opts.height || 260, opts.emptyText || '当前物品没有价格节点', P);
    const width = opts.width || 1000;
    const height = opts.height || 260;
    const ml = 64, mr = 22, mt = 22, mb = 44;
    const plotW = width - ml - mr;
    const plotH = height - mt - mb;
    const values = data.map(function (point) { return point.price; });
    let minV = Math.min.apply(null, values), maxV = Math.max.apply(null, values);
    if (!(maxV > minV)) maxV = minV + Math.max(1, Math.abs(minV) * 0.04);
    const pad = (maxV - minV) * 0.1;
    minV = Math.max(0, minV - pad); maxV += pad;
    const y = function (v) { return mt + plotH - ((v - minV) / (maxV - minV)) * plotH; };
    const times = data.map(function (point) { return Date.parse(point.at); });
    let t0 = Math.min.apply(null, times), t1 = Math.max.apply(null, times);
    if (t1 <= t0) t1 = t0 + 3600000;
    const x = function (at) { return ml + (Date.parse(at) - t0) / (t1 - t0) * plotW; };
    let svg = '<svg class="chart-svg" viewBox="0 0 ' + width + ' ' + height + '" style="width:' + width + 'px;max-width:none" role="img" aria-label="' +
      attr(opts.ariaLabel || '单品物价变化') + '">';
    svg += '<rect width="' + width + '" height="' + height + '" fill="' + P.bg + '"/>';
    for (let i = 0; i <= 4; i++) {
      const v = minV + (maxV - minV) * i / 4;
      const yy = y(v);
      svg += '<line x1="' + ml + '" y1="' + yy.toFixed(1) + '" x2="' + (width - mr) + '" y2="' + yy.toFixed(1) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + (ml - 8) + '" y="' + (yy + 3).toFixed(1) + '" text-anchor="end" font-size="10" fill="' + P.muted + '">' +
        U.esc(U.fmt(v, v < 1 ? 2 : v < 100 ? 1 : 0)) + '</text>';
    }
    svg += '<text x="' + ml + '" y="' + (mt - 7) + '" font-size="10" fill="' + P.muted + '">单价（金）</text>';
    data.forEach(function (point, i) {
      if (i === 0) return;
      const prev = data[i - 1];
      const x1 = x(prev.at), y1 = y(prev.price), x2 = x(point.at), y2 = y(point.price);
      svg += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) +
        '" stroke="' + (opts.color || COLOR.craft) + '" stroke-width="1.8"/>';
    });
    data.forEach(function (point, i) {
      const cx = x(point.at), cy = y(point.price);
      const tip = String(point.at || '').replace('T', ' ') + ' · ' + U.fmt(point.price, 2) + ' 金';
      svg += '<circle class="chart-point" tabindex="0" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + (i === data.length - 1 ? 4.2 : 3.2) +
        '" fill="' + (opts.color || COLOR.craft) + '" fill-opacity=".9"' +
        (i === data.length - 1 ? ' stroke="' + P.text + '" stroke-width="1.5"' : '') +
        ' data-tip="' + attr(tip) + '" aria-label="' + attr(tip) + '"/>';
    });
    const labelCount = data.length <= 8 ? data.length : 5;
    for (let i = 0; i < labelCount; i++) {
      const point = data[data.length <= 8 ? i : Math.round(i * (data.length - 1) / 4)];
      const cx = x(point.at);
      const d = new Date(Date.parse(point.at));
      const text = (d.getMonth() + 1) + '-' + String(d.getDate()).padStart(2, '0') + ' ' +
        String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
      svg += '<line x1="' + cx.toFixed(1) + '" y1="' + mt + '" x2="' + cx.toFixed(1) + '" y2="' + (height - mb) +
        '" stroke="' + P.grid + '" stroke-width="1"/>';
      svg += '<text x="' + cx.toFixed(1) + '" y="' + (height - mb + 16) + '" text-anchor="middle" font-size="10" fill="' + P.muted + '">' +
        U.esc(text) + '</text>';
    }
    svg += '</svg>';
    return svg;
  }

  window.JX3Charts = {
    palette: palette,
    color: COLOR,
    barH: barH,
    scatter: scatter,
    boxPlot: boxPlot,
    diffBar: diffBar,
    columns: columns,
    candle: candle,
    trendScatter: trendScatter,
    priceDistribution: priceDistribution,
    categoryScatter: categoryScatter,
    priceLine: priceLine,
    emptyChart: emptyChart
  };
})();
