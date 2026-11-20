/* =========================================================================
   云端行情同步：微信云开发数据库 prices/current
   - 仅在微信端、且 cloudConfig.CLOUD_ENV 已配置时启用
   - 失败自动回退到本地已保存行情/包内示例价
   ========================================================================= */
import Taro from '@tarojs/taro';
import { DATA } from './engine';
import { round } from './format';
import {
  CLOUD_ENV, PRICE_COLLECTION, PRICE_DOC_ID, PRICE_TTL_MS, isCloudConfigured
} from './cloudConfig';

let inited = false;
let inflight = null;

function initCloud() {
  if (inited) return;
  if (!Taro.cloud || typeof Taro.cloud.init !== 'function') {
    throw new Error('当前运行环境不支持微信云开发');
  }
  Taro.cloud.init({ env: CLOUD_ENV, traceUser: false });
  inited = true;
}

function priceValue(raw) {
  const v = raw && typeof raw === 'object' ? raw.v : raw;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 && n < 1e9 ? round(n, 4) : null;
}

function cleanServerPrices(raw) {
  const serverIds = {};
  (DATA.servers || []).forEach(function (s) { serverIds[s.id] = true; });
  const itemIds = {};
  (DATA.items || []).forEach(function (i) { itemIds[i.id] = true; });
  const out = {};
  Object.keys(raw || {}).forEach(function (sid) {
    if (!serverIds[sid]) return;
    const bucket = {};
    Object.keys(raw[sid] || {}).forEach(function (itemId) {
      if (!itemIds[itemId]) return;
      const v = priceValue(raw[sid][itemId]);
      if (v != null) bucket[itemId] = v;
    });
    if (Object.keys(bucket).length) out[sid] = bucket;
  });
  return out;
}

function cleanStonePrices(raw) {
  const out = {};
  Object.keys(raw || {}).forEach(function (sid) {
    const bucket = {};
    Object.keys(raw[sid] || {}).forEach(function (level) {
      const lv = Number(level);
      if (!(lv >= 1 && lv <= 8)) return;
      const v = priceValue(raw[sid][level]);
      if (v != null) bucket[String(lv)] = v;
    });
    if (Object.keys(bucket).length) out[sid] = bucket;
  });
  return out;
}

function stamp(value, fallback) {
  const t = Date.parse(value || '');
  return Number.isFinite(t) ? t : fallback;
}

async function run(actions) {
  initCloud();
  const db = Taro.cloud.database();
  const res = await db.collection(PRICE_COLLECTION).doc(PRICE_DOC_ID).get();
  const payload = res && res.data;
  if (!payload || Number(payload.schema) !== 1) {
    throw new Error('云端行情数据格式不支持');
  }

  const serverPrices = cleanServerPrices(payload.serverPrices);
  const stonePrices = cleanStonePrices(payload.stonePrices);
  if (!Object.keys(serverPrices).length && !Object.keys(stonePrices).length) {
    throw new Error('云端行情为空');
  }

  const priceAt = stamp(payload.priceUpdatedAt, Date.now());
  const stoneAt = stamp(payload.stonePriceUpdatedAt, priceAt);
  const cleaned = {
    schema: 1,
    catalogVersion: String(payload.catalogVersion || ''),
    priceUpdatedAt: new Date(priceAt).toISOString(),
    stonePriceUpdatedAt: new Date(stoneAt).toISOString(),
    serverPrices: serverPrices,
    stonePrices: stonePrices
  };

  actions.applyMarketPrices(cleaned);

  return {
    ok: true,
    updatedAt: cleaned.priceUpdatedAt,
    servers: Object.keys(serverPrices).length,
    items: Object.keys(serverPrices).reduce(function (n, sid) { return n + Object.keys(serverPrices[sid]).length; }, 0),
    stones: Object.keys(stonePrices).reduce(function (n, sid) { return n + Object.keys(stonePrices[sid]).length; }, 0)
  };
}

/**
 * 拉取云端行情。
 * @param {object} actions store actions（applyMarketPrices）
 * @param {boolean} force 忽略 TTL
 * @param {object} currentState 当前 store state（用于 TTL）
 */
export function syncRemotePrices(actions, force, currentState) {
  if (!isCloudConfigured()) {
    return Promise.resolve({ ok: false, skipped: true, reason: 'not-configured' });
  }

  const meta = currentState && currentState.marketMeta;
  if (!force && meta && meta.fetchedAt && Date.now() - meta.fetchedAt < PRICE_TTL_MS) {
    return Promise.resolve({ ok: true, cached: true, updatedAt: meta.priceUpdatedAt });
  }
  if (inflight) return inflight;

  inflight = run(actions).then(function (res) {
    inflight = null;
    return res;
  }, function (err) {
    inflight = null;
    return { ok: false, error: (err && (err.errMsg || err.message)) || '云端行情同步失败' };
  });
  return inflight;
}
