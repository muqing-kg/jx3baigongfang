/**
 * 微信云开发配置。
 *
 * 使用前：
 * 1. 微信开发者工具 → 云开发 → 创建/进入环境，复制环境 ID（形如 cloud1-xxxxxx）。
 * 2. 把环境 ID 填到下面的 CLOUD_ENV。
 * 3. 在云开发控制台创建集合 `prices`，安全规则设为：
 *    { "read": true, "write": false }
 * 4. 在 GitHub 仓库 Secrets 配置 WX_APPID / WX_APPSECRET / TCB_ENV_ID，
 *    `Update JX3 prices` workflow 会写入 prices/current 文档。
 *
 * 留空时小程序保持完全离线，使用包内示例价。
 */
export const CLOUD_ENV = 'cloud1-d3g3bpdtmafb3abca';

export const PRICE_COLLECTION = 'prices';
export const PRICE_DOC_ID = 'current';
export const PRICE_TTL_MS = 6 * 60 * 60 * 1000;

export function isCloudConfigured() {
  return process.env.TARO_ENV === 'weapp' && !!CLOUD_ENV && CLOUD_ENV.indexOf('your-') !== 0;
}
