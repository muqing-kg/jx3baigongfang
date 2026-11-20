/* 百工坊 · 物价助手 PWA service worker
 * 构建时 __APP_VERSION__ 会被替换成“应用壳”版本（不含 data.js）。
 * 页面导航走网络优先：在线时始终拿到最新 index.html，缓存只作离线兜底。
 */
const VERSION = '__APP_VERSION__';
const CACHE = 'baigong-price-' + VERSION;
const DATA_CACHE = 'baigong-price-data';
const SHELL = [
  './',
  './index.html',
  './assets/styles.css',
  './assets/pwa.css',
  './assets/core.js',
  './assets/breakthrough.js',
  './assets/breakthrough-model.js',
  './assets/breakthrough-data.js',
  './assets/stones.js',
  './assets/charts.js',
  './assets/trends.js',
  './assets/app.js',
  './assets/install.css',
  './assets/install.js',
  './assets/pwa.js',
  './manifest.webmanifest',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(Promise.all([
    caches.open(CACHE).then((cache) => {
      return cache.addAll(SHELL.map((url) => new Request(url, { cache: 'reload' })));
    }),
    // 价格数据单独放一个缓存：应用壳更新时仍保留，数据更新不触发 SW 升级。
    caches.open(DATA_CACHE).then((cache) => {
      return cache.add(new Request('./assets/data.js', { cache: 'reload' }));
    }).catch(() => {})
  ]));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key.indexOf('baigong-price-') === 0 && key !== CACHE).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 根 SW 不能接管 /dev/ 预览：否则会把生产 index.html 返回给 dev，
  // 导致 dev 的 PWA/更新提示异常。dev 目录由 /dev/sw.js 自己管理。
  const IS_DEV_SW = self.location.pathname.includes('/dev/sw.js');
  if (!IS_DEV_SW && /\/dev(?:\/|$)/.test(url.pathname)) return;

  // 版本/更新说明永远走网络，避免被缓存成旧内容。
  if (url.pathname.endsWith('/version.json') || url.pathname.endsWith('/updates.json') || url.pathname.endsWith('/CHANGELOG.md')) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // 价格数据网络优先：后台更新只改 data.js，不新增 SW、不弹更新提示。
  // 离线时回退到上一次缓存的数据。
  if (url.pathname.endsWith('/assets/data.js')) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put('./assets/data.js', copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => {
          return caches.open(DATA_CACHE)
            .then((cache) => cache.match('./assets/data.js'))
            .then((hit) => hit || caches.match(request));
        })
    );
    return;
  }

  // 物价历史是持续增长的数据，网络优先；离线时回退到上次缓存。
  if (url.pathname.includes('/price-history/')) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(DATA_CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // 下载包不塞进 shell 缓存。
  if (url.pathname.includes('/downloads/')) return;

  if (request.mode === 'navigate') {
    // 网络优先：页面结构以服务器为准，离线时才回退到上次缓存的 index.html。
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put('./index.html', copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match('./index.html').then((hit) => hit || caches.match('./')))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((hit) => {
      if (hit) return hit;
      return fetch(request).then((response) => {
        if (response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        return response;
      });
    })
  );
});
