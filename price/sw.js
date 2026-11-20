/* 物价助手 · PWA service worker
 * 构建时 local 会被替换成“应用壳”版本（不含 data.js）。
 * 新版本安装后不自动 skipWaiting，等页面上的更新提示确认后再切换。
 */
const VERSION = 'local';
const CACHE = 'jx3-shell-' + VERSION;
const DATA_CACHE = 'jx3-data';
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
  './assets/app.js',
  './assets/install.css',
  './assets/install.js',
  './assets/pwa.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
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
        keys.filter((key) => key.indexOf('jx3-shell-') === 0 && key !== CACHE).map((key) => caches.delete(key))
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

  // 下载包不塞进 shell 缓存。
  if (url.pathname.includes('/downloads/')) return;

  if (request.mode === 'navigate') {
    // 优先使用缓存中的 index.html，保证 HTML 与 assets 来自同一个版本；
    // 新版本由 waiting SW + 更新提示切换，避免新旧文件混用导致布局错乱。
    event.respondWith(
      caches.match('./index.html').then((hit) => {
        if (hit) return hit;
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put('./index.html', copy)).catch(() => {});
          }
          return response;
        });
      })
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
