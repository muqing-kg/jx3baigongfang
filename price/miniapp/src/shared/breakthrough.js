/* 突破升级小程序适配：与 Web 使用同一计算模型。 */
import BT from './breakthrough.json';
import catalog from './catalog.json';
import createBreakthrough from './breakthrough-model';
export { BT };
export const SKILL_IDS = ['shennong', 'caijin', 'paoding', 'duanzao', 'fengren', 'zhiyao', 'pengren', 'zijiang'];
export const MODES = [{ key: 'low', label: '低收益比档' }, { key: 'mid', label: '中收益比档' }, { key: 'high', label: '高收益比档' }];
const cache = new WeakMap();
function model(state, serverId) {
  let models = cache.get(state);
  if (!models) { models = {}; cache.set(state, models); }
  const sid = serverId || state.serverId;
  if (!models[sid]) models[sid] = createBreakthrough(BT, catalog, function () { return Object.assign({}, state, { serverId: sid }); });
  return models[sid];
}
export function analyze(state, skillId, strategy, serverId, mode) { return model(state, serverId).analyze(skillId, strategy, mode); }
export function allSkillsSummary(state, strategy, serverId, mode) { return model(state, serverId).summary(strategy, mode); }
export function gatherOutputs(state, recipe, serverId) { return model(state, serverId).gatherOutputs(recipe, serverId); }
const textModel = createBreakthrough(BT, catalog, function () { return {}; });
export const formatRange = textModel.formatRange;
export const itemOf = textModel.itemOf;
export const itemsText = textModel.itemsText;
export const matsText = textModel.matsText;
export const expToNext = textModel.expToNext;
export function strategyLabel(k) { return { gold: '金币优先', energy: '精力优先', effort: '省心（次数最少）' }[k] || '金最优'; }
