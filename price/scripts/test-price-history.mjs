#!/usr/bin/env node
/**
 * 物价历史存储回归测试。
 *   node scripts/test-price-history.mjs
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  compactPriceHistoryDay,
  eachHistoryPoint,
  extractSelectedValues,
  listPriceHistoryDays,
  loadPriceHistoryDay,
  priceHistoryStateAt,
  readPriceHistoryIndex,
  rebuildPriceHistoryIndex,
  recordPriceSnapshot,
  seedPriceHistory,
} from './lib/price-history.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'jx3-price-history-'));

function makeData(overrides = {}) {
  return Object.assign({
    meta: {
      catalogVersion: 'test-v1',
      priceUpdatedAt: '2026-11-20T09:00:00+08:00',
      serverCoverage: {
        s_a: { updated: 2, total: 2, filtered: 0, noQuote: 0 },
        s_b: { updated: 1, total: 2, filtered: 1, noQuote: 0 },
      },
    },
    servers: [
      { id: 's_a', name: '测试服甲', region: '电信一区' },
      { id: 's_b', name: '测试服乙', region: '双线一区' },
    ],
    items: [
      { id: 'i1', name: '物品一', base: 10 },
      { id: 'i2', name: '物品二', base: 20 },
      { id: 'i3', name: '物品三', base: 30 },
    ],
    stones: [{ level: 1, itemId: 'stone_1', name: '五行石（一级）', base: 0.8 }],
    serverPrices: {
      s_a: { i1: 10, i2: 20 },
      s_b: { i1: 11 },
    },
    stonePrices: {
      s_a: { 1: 0.8 },
    },
  }, overrides);
}

function pricesAt(stamp) {
  const state = priceHistoryStateAt(root, new Date(stamp));
  assert.ok(state, `expected state at ${stamp}`);
  return state;
}

try {
  const data = makeData();

  // 1. 首次写入 = 完整 base，不产生 sample。
  const first = recordPriceSnapshot({
    root,
    data,
    at: '2026-11-20T09:00:00+08:00',
    requestedServerIds: ['s_a', 's_b'],
    serverCoverage: data.meta.serverCoverage,
    source: 'test',
    force: true,
  });
  assert.equal(first.created, true);
  assert.equal(first.appended, false);
  assert.ok(fs.existsSync(first.file));
  let day = loadPriceHistoryDay(root, '2026-11-20');
  assert.equal(day.base.prices.s_a.i1, 10);
  assert.equal(day.base.stones.s_a['1'], 0.8);
  assert.equal(day.base.catalogPrices.i3, 30);
  assert.equal(day.base.stoneCatalogPrices['1'], 0.8);
  assert.deepEqual(day.base.coverage.s_a, [2, 0, 0]);
  assert.equal(day.samples.length, 0);
  assert.equal(readPriceHistoryIndex(root).days.length, 1);

  // 2. 价格变化 = 追加增量；删除的报价用 null 表示。
  const changed = makeData();
  changed.serverPrices = {
    s_a: { i1: 12 },
    s_b: { i1: 11, i2: 30 },
  };
  changed.stonePrices = { s_a: { 1: 0.9 } };
  const second = recordPriceSnapshot({
    root,
    data: changed,
    at: '2026-11-20T10:30:00+08:00',
    requestedServerIds: ['s_a', 's_b'],
    serverCoverage: changed.meta.serverCoverage,
    source: 'test',
  });
  assert.equal(second.appended, true);
  assert.equal(second.changed, 4); // s_a.i1, s_a.i2=null, s_b.i2, stone
  day = loadPriceHistoryDay(root, '2026-11-20');
  assert.equal(day.samples.length, 1);
  assert.equal(day.samples[0].prices.s_a.i2, null);
  assert.equal(day.samples[0].prices.s_b.i2, 30);
  assert.equal(day.samples[0].stones.s_a['1'], 0.9);

  // 3. 价格没变 = 不写文件。
  const unchanged = recordPriceSnapshot({
    root,
    data: changed,
    at: '2026-11-20T11:00:00+08:00',
    requestedServerIds: ['s_a', 's_b'],
    serverCoverage: changed.meta.serverCoverage,
    source: 'test',
  });
  assert.equal(unchanged.appended, false);
  assert.equal(loadPriceHistoryDay(root, '2026-11-20').samples.length, 1);

  // 4. 时间点回溯。
  const before = pricesAt('2026-11-20T09:30:00+08:00');
  assert.equal(before.at, '2026-11-20T09:00:00+08:00');
  assert.equal(before.state.prices.s_a.i1, 10);
  assert.equal(before.state.prices.s_a.i2, 20);
  const after = pricesAt('2026-11-20T10:45:00+08:00');
  assert.equal(after.at, '2026-11-20T10:30:00+08:00');
  assert.equal(after.state.prices.s_a.i1, 12);
  assert.equal(after.state.prices.s_a.i2, undefined);
  assert.equal(after.state.prices.s_b.i2, 30);
  assert.equal(after.state.stones.s_a['1'], 0.9);
  assert.equal(after.state.catalogPrices.i1, 10);
  assert.equal(after.state.catalogPrices.i3, 30);

  // 5. 跨天：新的一天重新建立完整 base。
  const nextDay = makeData();
  nextDay.meta.priceUpdatedAt = '2026-11-21T09:00:00+08:00';
  nextDay.items[0].base = 15;
  nextDay.serverPrices = { s_a: { i1: 15 }, s_b: { i1: 16 } };
  nextDay.stonePrices = { s_a: { 1: 1.0 } };
  nextDay.stones[0].base = 1.0;
  const third = recordPriceSnapshot({
    root,
    data: nextDay,
    at: '2026-11-21T09:00:00+08:00',
    requestedServerIds: ['s_a', 's_b'],
    serverCoverage: nextDay.meta.serverCoverage,
    source: 'test',
    force: true,
  });
  assert.equal(third.created, true);
  assert.equal(listPriceHistoryDays(root).length, 2);
  assert.equal(pricesAt('2026-11-20T23:00:00+08:00').state.prices.s_a.i1, 12);
  assert.equal(pricesAt('2026-11-21T10:00:00+08:00').state.prices.s_a.i1, 15);
  assert.equal(pricesAt('2026-11-21T10:00:00+08:00').state.catalogPrices.i1, 15);

  // 6. 遍历快照点并抽取筛选值。
  const points = [];
  eachHistoryPoint(root, (point) => {
    points.push({
      at: point.at,
      a1: point.state.prices.s_a && point.state.prices.s_a.i1,
    });
  });
  assert.deepEqual(points.map((point) => point.at), [
    '2026-11-20T09:00:00+08:00',
    '2026-11-20T10:30:00+08:00',
    '2026-11-21T09:00:00+08:00',
  ]);
  const selected = extractSelectedValues(
    pricesAt('2026-11-21T10:00:00+08:00').state,
    { serverIds: ['s_a'], itemIds: ['i1', 'stone:1'] },
  );
  assert.equal(selected.size, 2);
  assert.equal(selected.get('s_a\u0000item\u0000i1').price, 15);
  assert.equal(selected.get('s_a\u0000stone\u00001').price, 1.0);

  // 7. 折叠：保留当日最后快照，清空 samples。
  assert.equal(compactPriceHistoryDay(root, '2026-11-20'), true);
  day = loadPriceHistoryDay(root, '2026-11-20');
  assert.equal(day.samples.length, 0);
  assert.equal(day.compacted, true);
  assert.equal(day.base.at, '2026-11-20T10:30:00+08:00');
  assert.equal(day.base.catalogPrices.i3, 30);
  assert.equal(priceHistoryStateAt(root, new Date('2026-11-20T09:30:00+08:00')), null);
  assert.equal(pricesAt('2026-11-20T12:00:00+08:00').at, '2026-11-20T10:30:00+08:00');
  assert.equal(pricesAt('2026-11-20T12:00:00+08:00').state.prices.s_a.i1, 12);

  // 8. 索引可重建；seed 对已有日期不重复写。
  fs.rmSync(path.join(root, 'data/price-history/index.json'));
  const rebuilt = rebuildPriceHistoryIndex(root, makeData());
  assert.equal(rebuilt.days.length, 2);
  assert.equal(seedPriceHistory(root, makeData()).skipped, 'day-exists');
  assert.equal(seedPriceHistory(root, makeData(), '2026-11-19T09:00:00+08:00').created, true);
  assert.equal(listPriceHistoryDays(root).length, 3);
  assert.equal(priceHistoryStateAt(root, new Date('2026-11-20T09:30:00+08:00')), null);

  // 9. 同秒重跑：替换最后一条 sample，而不是重复追加。
  const replay = makeData();
  replay.serverPrices = { s_a: { i1: 99 } };
  recordPriceSnapshot({
    root,
    data: replay,
    at: '2026-11-21T10:00:00+08:00',
    requestedServerIds: ['s_a', 's_b'],
    serverCoverage: replay.meta.serverCoverage,
    source: 'test',
  });
  const replayAgain = makeData();
  replayAgain.serverPrices = { s_a: { i1: 100 } };
  recordPriceSnapshot({
    root,
    data: replayAgain,
    at: '2026-11-21T10:00:00+08:00',
    requestedServerIds: ['s_a', 's_b'],
    serverCoverage: replayAgain.meta.serverCoverage,
    source: 'test',
  });
  day = loadPriceHistoryDay(root, '2026-11-21');
  assert.equal(day.samples.filter((sample) => sample.at === '2026-11-21T10:00:00+08:00').length, 1);
  assert.equal(pricesAt('2026-11-21T10:00:00+08:00').state.prices.s_a.i1, 100);

  console.log('PASS: price history base, delta, null removal, no-op, as-of, cross-day, compact, reindex, seed, same-second replay.');
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
