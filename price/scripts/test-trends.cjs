#!/usr/bin/env node
/* 物价走势数据回归测试：node scripts/test-trends.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const DATA = {
  skills: [
    { id: 's1', name: '缝纫', color: '#111111' },
    { id: 's2', name: '锻造', color: '#222222' }
  ],
  items: [
    { id: 'i1', name: '物品一', kind: 'product', skillId: 's1', tier: 4 },
    { id: 'i2', name: '材料一', kind: 'material', skillId: 's1', tier: 3 },
    { id: 'i3', name: '物品二', kind: 'product', skillId: 's2', tier: 4 }
  ],
  stones: [
    { level: 6, itemId: 'stone_6', name: '五行石（六级）', base: 500 }
  ],
  recipes: [
    { skillId: 's2', materials: [{ item: 'i2', qty: 1 }], outputs: [{ item: 'i3', qty: 1 }] }
  ]
};
const day = {
  date: '2026-11-20',
  itemCount: 3,
  base: {
    at: '2026-11-20T10:00:00+08:00',
    requested: ['s1'],
    source: 'seed',
    coverage: { s1: [2, 0, 1] },
    prices: { s1: { i1: 120 } },
    stones: { s1: { 6: 520 } },
    catalogPrices: { i1: 100, i2: 5, i3: 50 },
    stoneCatalogPrices: { 6: 500 }
  },
  samples: [
    {
      at: '2026-11-20T11:00:00+08:00',
      requested: ['s1'],
      source: 'update',
      coverage: { s1: [2, 0, 1] },
      prices: { s1: { i1: 90, i2: 6 } },
      stones: { s1: { 6: 510 } },
      catalogPrices: { i1: 90 }
    },
    {
      at: '2026-11-20T12:00:00+08:00',
      requested: ['s1'],
      source: 'update',
      coverage: { s1: [1, 0, 2] },
      prices: { s1: { i1: null, i2: null } },
      catalogPrices: { i2: 7, i3: 55 }
    }
  ]
};

const sandbox = {
  window: { JX3Data: DATA, console },
  document: { baseURI: 'https://example.test/JX3-AH-Calculator/' },
  location: { href: 'https://example.test/JX3-AH-Calculator/' },
  URL,
  console,
  setTimeout,
  clearTimeout
};
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root, 'assets/trends.js'), 'utf8'), sandbox, { filename: 'assets/trends.js' });
const T = sandbox.window.JX3Trends;
assert.ok(T, 'JX3Trends should be exported');

const points = T._test.buildPoints('s1', [day]);
assert.equal(points.length, 3);
assert.equal(points[0].at, '2026-11-20T10:00:00+08:00');
assert.equal(points[0].prices.i1, 120);
assert.equal(points[0].prices.i2, 5, 'fallback to catalog price');
assert.equal(points[0].stonePrices['6'], 520);
assert.equal(points[0].itemCount, 3);
assert.equal(points[1].prices.i1, 90);
assert.equal(points[1].prices.i2, 6);
assert.equal(points[1].stonePrices['6'], 510);
assert.equal(points[1].changed, 4);
assert.equal(points[2].prices.i1, 90, 'removed quote falls back to catalog');
assert.equal(points[2].prices.i2, 7);
assert.equal(points[2].prices.i3, 55);
assert.equal(points[2].changed, 4);
assert.equal(points[2].coverage[0], 1);

const series = T._test.itemSeries(points, 'item:i1');
assert.equal(series.map((p) => p.price).join(','), '120,90,90');
assert.equal(series.map((p) => p.source).join(','), '本服报价,本服报价,基准价');
const stoneSeries = T._test.itemSeries(points, 'stone:6');
assert.equal(stoneSeries.map((p) => p.price).join(','), '520,510,510');

const candles = T._test.candles(series);
assert.equal(candles.length, 2);
assert.equal(candles[0].open, 120);
assert.equal(candles[0].close, 90);
assert.equal(candles[0].high, 120);
assert.equal(candles[0].low, 90);
assert.equal(candles[1].open, 90);
assert.equal(candles[1].close, 90);

const scatter = T._test.scatter(points, { type: 'all', metric: 'change', highlightKey: 'item:i1' });
assert.ok(scatter.total >= 3);
const i2Rows = scatter.rows.filter((r) => r.itemKey === 'item:i2');
assert.equal(i2Rows.length, 3);
assert.equal(i2Rows[0].change, 0);
assert.equal(Math.round(i2Rows[2].change), 40);
const highlighted = scatter.rows.filter((r) => r.highlight);
assert.equal(highlighted.length, 3);
assert.equal(highlighted[highlighted.length - 1].highlight, true);

const stats = T._test.scopeStats(points, { type: 'all' });
assert.equal(stats.itemCount, 4, '3 items + 1 stone');
assert.equal(stats.pricedCount, 4);
assert.ok(stats.topMover);
assert.equal(stats.topMover.key, 'item:i2');
assert.equal(Math.round(stats.topMover.change * 100), 40);
assert.equal(stats.latest.coverage[0], 1);

assert.equal(T._test.items('material').length, 1);
assert.equal(T._test.items('product').length, 2);
assert.equal(T._test.items('stone').length, 1);
assert.equal(T._test.items('all', 's1').length, 2);
assert.ok(T._test.items('material', 's2').some((item) => item.id === 'i2'), '材料按配方用途归入多个技艺');
assert.ok(T._test.items('material', 's1').some((item) => item.id === 'i2'));
assert.equal(T._test.atText(points[0].at), '2026-11-20 10:00');

// 小时范围：起始取整点，结束包含该小时的 59:59.999；日期-only 结束取整天。
const ten = T._test.parseBound('2026-11-20T10:00', false);
const tenEnd = T._test.parseBound('2026-11-20T10:00', true);
const eleven = T._test.parseBound('2026-11-20T11:00', false);
assert.equal(ten, Date.parse('2026-11-20T10:00:00+08:00'));
assert.equal(tenEnd, Date.parse('2026-11-20T10:59:59.999+08:00'));
assert.equal(T._test.parseBound('2026-11-20', true), Date.parse('2026-11-20T23:59:59.999+08:00'));
assert.equal(T._test.hourText(Date.parse('2026-11-20T13:07:15+08:00')), '2026-11-20T13:00');
assert.equal(T._test.hourText(tenEnd), '2026-11-20T10:00');
const firstHour = T._test.slicePoints(points, ten, tenEnd);
assert.equal(firstHour.length, 1);
assert.equal(firstHour[0].at, '2026-11-20T10:00:00+08:00');
const firstTwoHours = T._test.slicePoints(points, ten, T._test.parseBound('2026-11-20T11:00', true));
assert.equal(firstTwoHours.length, 2);
assert.equal(T._test.slicePoints(points, eleven, T._test.endOfHourMs(Date.parse('2026-11-20T11:30:00+08:00'))).length, 1);

console.log('PASS: trends buildPoints, fallback, series, candles, scatter, scope stats, filters and hour range.');
