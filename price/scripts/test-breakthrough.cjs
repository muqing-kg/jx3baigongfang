/* Run: node scripts/test-breakthrough.cjs */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const createModel = require('../miniapp/src/shared/breakthrough-model');
const catalog = require('../miniapp/src/shared/catalog.json');
const data = require('../miniapp/src/shared/breakthrough.json');
const mapping = require('./jx3-item-map.json');
const experienceModel = require('../miniapp/src/shared/experience-model.json');
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-6, `${a} != ${b}`);

// Hand-computable fixtures: equal-width ROI bands, then lowest actual net spend.
const named = catalog.items.filter(i => mapping[i.name]).slice(0, 3);
function fixture() {
  const cat = { meta: {}, items: named, skills: [{ id: 'duanzao', name: '锻造', type: 'craft' }], serverPrices: { test: { [named[0].id]: 5, [named[1].id]: 10, [named[2].id]: 7 } } };
  const bt = { meta: { levelCap: 50, expModel: { base: 500, step: 25 } }, items: named.map(i => ({ n: i.name, k: mapping[i.name] })), recipes: [
    { i: 1, s: 'duanzao', n: '低收益配方', l: 1, x: 500, e: 10, m: [[0, 1]], o: [[1, 1, 1, 1]] },
    { i: 2, s: 'duanzao', n: '中收益配方', l: 1, x: 500, e: 10, m: [[0, 1]], o: [[1, 5, 5, 1]] },
    { i: 3, s: 'duanzao', n: '高收益配方', l: 1, x: 500, e: 10, m: [[0, 1]], o: [[1, 8, 12, 1]] },
    { i: 4, s: 'duanzao', n: '低档省金币配方', l: 1, x: 250, e: 10, m: [[0, 1]], o: [[1, 2, 2, 1]] },
    { i: 5, s: 'duanzao', n: '高档省金币配方', l: 1, x: 50, e: 10, m: [[0, 1]], o: [[1, 180 / 19, 180 / 19, 1]] }
  ], gates: { duanzao: [30, 35, 40, 45].map(l => ({ l, n: '晋秩', r: [[2, 1]] })) }, prices: { test: [99, 99, 99] } };
  const state = { serverId: 'test', settings: { basis: 'market', taxRate: .05 }, prices: { [named[0].id]: 999 } };
  return { cat, bt, model: createModel(bt, cat, () => state) };
}
{
  const { model } = fixture();
  assert.equal(model.priceOfIndex(0).v, 5, 'script quote precedes user/base/snapshot prices');
  const low = model.analyze('duanzao', 'gold', 'low');
  const mid = model.analyze('duanzao', 'gold', 'mid');
  const high = model.analyze('duanzao', 'gold', 'high');
  assert.equal(low.levels[0].recipe.i, 4);
  assert.equal(mid.levels[0].recipe.i, 2);
  near(low.levels[0].profit, 28);
  near(low.levels[0].band.mean, .925);
  near(mid.levels[0].profit, 42.5);
  near(mid.levels[0].band.mean, 4.25);
  assert.equal(high.levels[0].recipe.i, 5);
  near(high.levels[0].profit, 850);
  near(high.levels[0].band.mean, 8.75);
  near(high.levels[0].econ.outs[0].qty, 180 / 19, 'all bands use midpoint output, never min/max production');
  assert.equal(mid.gates.length, 4);
  assert.equal(mid.experience.length, 49);
  assert.equal(model.expToNext(50), null);
  assert.deepEqual(mid.phases.map(p => p.exp), [24650, 29250]);
  assert.equal(mid.totals.gateCost, 28);
  near(mid.totals.total, mid.phases[0].total + mid.phases[1].total);
  for (const level of [30, 35, 40, 45]) {
    const idx = mid.routes.findIndex(r => r.kind === 'gate' && r.level === level);
    assert.equal(mid.routes[idx - 1].to, level);
    assert.equal(mid.routes[idx + 1].from, level);
  }
}
{
  const { cat, bt } = fixture();
  bt.recipes = bt.recipes.filter(r => r.i !== 2);
  const model = createModel(bt, cat, () => ({ serverId: 'test', settings: { basis: 'market', taxRate: .05 } }));
  const middle = model.analyze('duanzao', 'gold', 'mid');
  assert.equal(middle.levels[0].band.count, 0);
  assert.equal(middle.levels[0].recipe, null, 'empty ROI bands must not borrow another band or fabricate an average');
  assert.equal(middle.totals.netCost, null);
  assert.equal(model.analyze('duanzao', 'energy').enough, true);
}
{
  const { model, cat, bt } = fixture();
  delete cat.serverPrices.test[named[2].id];
  assert.equal(model.priceOfIndex(2).v, 99, 'same-server breakthrough snapshot supplements primary quotes');
  bt.prices.test[2] = null;
  const r = model.analyze('duanzao', 'gold');
  assert.equal(r.gates[0].cost, null);
  assert.equal(r.gates[0].items[0].sub, null);
  assert.equal(r.gates[0].missingItems[0].name, named[2].name);
  assert.equal(r.totals.gateCost, null);
  assert.equal(r.totals.total, null);
  assert.equal(r.phases[0].total, null);
  assert.equal(r.enough, false);
  delete cat.serverPrices.test[named[1].id];
  bt.prices.test[1] = null;
  const incomplete = model.analyze('duanzao', 'gold');
  assert.equal(incomplete.totals.missingLevels, 49, 'unpriced output cannot become zero revenue');
  assert.equal(incomplete.totals.profit, null);
  assert.equal(incomplete.totals.energy, null);
  const energy = model.analyze('duanzao', 'energy');
  assert.equal(energy.enough, true, 'prices must not disqualify the lowest-energy route');
  assert.ok(energy.totals.energy > 0);
  assert.equal(energy.totals.profit, null);
  assert.equal(energy.totals.total, null);
}
{
  const { cat, bt } = fixture();
  bt.recipes.push({ i: 6, s: 'duanzao', n: '自制任务材料', l: 1, x: 10, e: 5, m: [[0, 1]], o: [[2, 1, 1, 1]] });
  delete cat.serverPrices.test[named[2].id];
  bt.prices.test[2] = null;
  const model = createModel(bt, cat, () => ({ serverId: 'test', settings: { basis: 'min', taxRate: .05 } }));
  const gate = model.analyze('duanzao', 'gold').gates[0];
  assert.equal(gate.items[0].craft, 5, 'self-craft cost remains available as a reference');
  assert.equal(gate.items[0].missing, true, 'unpriced task materials must still be called out under the min-cost basis');
  assert.equal(gate.cost, null);
}
{
  const { model, bt } = fixture();
  bt.recipes[0].o[0] = [1, 1, 5, .5];
  bt.recipes.splice(1);
  near(model.analyze('duanzao', 'gold', 'mid').levels[0].econ.outs[0].qty, 1.5);
  near(model.analyze('duanzao', 'gold', 'mid').levels[0].profit, 9.25);
}

// All servers, skills, strategies and yield scenarios: no hidden unknown totals,
// no routes crossing gates, and phase sums conserve each complete route's totals.
assert.deepEqual(data.meta.expModel, experienceModel, 'regeneration must retain the calibrated observations');
{
  const model = createModel(data, catalog, () => ({ serverId: catalog.servers[0].id, settings: { basis: 'market', taxRate: .05 } }));
  const rows = model.experienceRows();
  for (const [level, exp] of [[1, 250], [3, 510], [8, 1150], [11, 1370], [30, 1650]]) {
    assert.equal(model.expToNext(level), exp, 'observed thresholds must be preserved exactly');
    assert.equal(rows[level - 1].source, 'observed');
    assert.equal(rows[level - 1].estimated, false);
  }
  assert.equal(model.expToNext(2), 380);
  assert.equal(model.expToNext(4), 640);
  assert.equal(model.expToNext(12), 1380);
  assert.equal(model.expToNext(31), 1660);
  assert.equal(model.expToNext(49), 1930);
  assert.equal(rows.filter(r => r.source === 'interpolated').length, 25);
  assert.equal(rows.filter(r => r.source === 'extrapolated').length, 19);
  assert.equal(rows[29].cumulative, 38330, '30→31 is distinct from reaching level 30');
  for (const strategy of ['energy', 'effort']) {
    const reference = model.analyze('duanzao', strategy, 'mid');
    for (const mode of ['low', 'high']) {
      const result = model.analyze('duanzao', strategy, mode);
      assert.equal(result.mode, 'mid');
      assert.deepEqual(result.totals, reference.totals, 'non-gold strategies must not create three different yield routes');
      assert.deepEqual(result.levels.map(x => [x.recipe && x.recipe.i, x.count]), reference.levels.map(x => [x.recipe && x.recipe.i, x.count]));
    }
  }
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i].need >= rows[i - 1].need);
  // Rounding applies only to inferred values, never a future observation such as 255.
  const custom = JSON.parse(JSON.stringify(data));
  custom.meta.expModel.observations[0].exp = 255;
  const customModel = createModel(custom, catalog, () => ({}));
  assert.equal(customModel.expToNext(1), 255);
  custom.meta.expModel.observations[1].level = 1;
  assert.throws(() => createModel(custom, catalog, () => ({})), /Invalid experience observations/);
}
let cases = 0;
for (const server of catalog.servers) {
  const state = { serverId: server.id, settings: { basis: 'market', taxRate: .05 } };
  const model = createModel(data, catalog, () => state);
  for (const skill of catalog.skills) for (const strategy of ['gold', 'energy', 'effort']) for (const mode of ['low', 'mid', 'high']) {
    const r = model.analyze(skill.id, strategy, mode);
    assert.equal(r.gates.length, 4);
    assert.equal(r.levels.length, 49);
    assert.equal(r.totals.exp, 72480);
    assert.deepEqual(r.phases.map(p => p.exp), [36680, 35800]);
    for (const level of r.levels) if (level.econ) assert.equal(level.count, Math.ceil(level.need / level.econ.exp), 'new thresholds must drive actual crafting counts');
    if (strategy === 'energy' && mode === 'mid') {
      const pool = skill.type === 'gather' ? catalog.recipes.filter(x => x.kind === 'gather' && x.skillId === skill.id) : data.recipes.filter(x => x.s === skill.id);
      for (const level of r.levels) {
        const possible = pool.filter(x => (skill.type === 'gather' ? x.level : x.l) <= level.from).map(x => Math.ceil(level.need / (skill.type === 'gather' ? data.meta.gatherExp : x.x)) * (skill.type === 'gather' ? x.energy : x.e));
        if (possible.length) assert.equal(level.totalEnergy, Math.min(...possible), 'minimum-energy choice must be absolute, independent of any quote or income ratio');
      }
    }
    for (const row of r.routes.filter(x => x.kind === 'level')) assert.ok(!model.GATE_LEVELS.some(g => row.from < g && row.to > g));
    if (r.enough) {
      for (const k of ['profit', 'gateCost', 'total', 'energy', 'crafts', 'outValue']) { if (r.totals[k] == null) assert.ok(r.phases.some(p => p[k] == null)); else near(r.totals[k], r.phases[0][k] + r.phases[1][k]); }
    } else assert.equal(r.totals.total, null);
    cases++;
  }
  const summary = model.summary('gold');
  let missingSeen = false;
  for (const row of summary) { if (!row.enough) missingSeen = true; else assert.equal(missingSeen, false); }
  for (const skill of ['caijin', 'paoding']) assert.equal(model.analyze(skill, 'gold').totals.missingLevels, 19, 'higher-level nodes cannot fill levels 1–19');
}
// Both browser bundles must contain the exact same model and expose working adapters.
const source = fs.readFileSync('miniapp/src/shared/breakthrough-model.js', 'utf8');
for (const base of ['assets', 'minitool/assets']) {
  assert.equal(fs.readFileSync(`${base}/breakthrough-model.js`, 'utf8'), source);
  const ctx = { window: { JX3Breakthrough: data, JX3Data: catalog, JX3Core: { Store: { state: { serverId: catalog.servers[0].id, settings: { basis: 'market', taxRate: .05 } } } } } };
  vm.runInNewContext(source, ctx);
  vm.runInNewContext(fs.readFileSync(`${base}/breakthrough.js`, 'utf8'), ctx);
  assert.equal(ctx.window.JX3BT.analyze('duanzao', 'gold').totals.exp, 72480);
  const bundle = { window: {} };
  vm.runInNewContext(fs.readFileSync(`${base}/breakthrough-data.js`, 'utf8'), bundle);
  assert.equal(JSON.stringify(bundle.window.JX3Breakthrough.meta.expModel), JSON.stringify(experienceModel));
}
console.log(`PASS: hand-calculated fixtures, missing quotes, gate boundaries, probability, ${cases} real-data cases and browser adapters.`);
