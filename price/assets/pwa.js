(function () {
  'use strict';

  if (!('serviceWorker' in navigator)) return;

  var secure = location.protocol === 'https:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1';
  if (!secure) return;

  var meta = document.querySelector('meta[name="app-version"]');
  var APP_VERSION = meta ? (meta.getAttribute('content') || '') : '';
  var buildMeta = document.querySelector('meta[name="app-build"]');
  var APP_BUILD = buildMeta ? (buildMeta.getAttribute('content') || '') : '';
  var IS_DEV = /\/dev(?:\/|$)/.test(location.pathname);
  // 未构建的本地文件（占位符）不启用更新提示。
  if (!APP_VERSION || APP_VERSION.indexOf('__') === 0) return;

  var registration = null;
  var reloading = false;
  var updating = false;
  var progressValue = 0;
  var banner = null;

  function escapeHtml(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function formatDate(value) {
    if (!value) return '';
    var match = String(value).match(/^\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : '';
  }

  function removeBanner() {
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    banner = null;
  }

  function render(data) {
    removeBanner();

    var notes = Array.isArray(data.notes) && data.notes.length
      ? data.notes.slice(0, 4)
      : ['修复已知问题，优化加载与交互'];

    var root = document.createElement('div');
    root.id = 'pwa-update';
    root.className = 'pwa-update';
    root.setAttribute('role', 'status');
    root.setAttribute('aria-live', 'polite');

    var list = notes.map(function (note) {
      return '<li>' + escapeHtml(note) + '</li>';
    }).join('');

    root.innerHTML =
      '<div class="pwa-update__head">' +
        '<span class="pwa-update__tag">更新</span>' +
        '<span class="pwa-update__head-text">发现新版本</span>' +
        '<span class="pwa-update__date">' + escapeHtml(formatDate(data.date)) + '</span>' +
      '</div>' +
      '<div class="pwa-update__title">' + escapeHtml(data.title || '本次更新内容') + '</div>' +
      '<ul class="pwa-update__notes">' + list + '</ul>' +
      '<div class="pwa-update__actions">' +
        '<button type="button" class="pwa-update__later">稍后</button>' +
        '<button type="button" class="pwa-update__go">立即更新</button>' +
      '</div>';

    root.querySelector('.pwa-update__later').addEventListener('click', function () {
      try { sessionStorage.setItem('pwa-later:' + data.latest, '1'); } catch (e) { /* ignore */ }
      removeBanner();
    });

    root.querySelector('.pwa-update__go').addEventListener('click', function () {
      beginUpdate();
    });

    document.body.appendChild(root);
    banner = root;
  }

  function setProgress(value, text) {
    progressValue = value;
    if (!banner) return;
    var track = banner.querySelector('.pwa-update__track');
    var fill = banner.querySelector('.pwa-update__track i');
    var status = banner.querySelector('.pwa-update__status');
    if (track) track.setAttribute('aria-valuenow', String(value));
    if (fill) fill.style.width = Math.max(0, Math.min(100, value)) + '%';
    if (status) status.textContent = text;
  }

  function beginUpdate() {
    if (updating) return;
    updating = true;
    if (!banner) { location.reload(); return; }

    var notes = banner.querySelector('.pwa-update__notes');
    var actions = banner.querySelector('.pwa-update__actions');
    if (notes) notes.style.display = 'none';
    if (actions) actions.style.display = 'none';

    var progress = document.createElement('div');
    progress.className = 'pwa-update__progress';
    progress.innerHTML =
      '<div class="pwa-update__track" role="progressbar" aria-label="更新进度" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div>' +
      '<div class="pwa-update__status" aria-live="polite">正在准备新版本…</div>';
    banner.appendChild(progress);
    setProgress(12, '正在准备新版本…');

    setTimeout(function () {
      if (updating && progressValue < 45) setProgress(45, '正在切换版本…');
    }, 280);
    setTimeout(function () {
      if (updating && progressValue < 65) setProgress(65, '正在应用更新…');
    }, 700);
    setTimeout(function () {
      if (updating && progressValue < 75) setProgress(75, '网络较慢，仍在更新…');
    }, 3000);

    if (registration && registration.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      setProgress(70, '正在应用更新…');
      setTimeout(function () {
        if (reloading) return;
        setProgress(100, '更新完成，正在刷新…');
        reloading = true;
        location.reload();
      }, 900);
    }

    // 兜底：controllerchange 没触发时也不能让用户一直等。
    setTimeout(function () {
      if (!updating || reloading) return;
      setProgress(92, '正在刷新页面…');
      setTimeout(function () {
        if (reloading) return;
        reloading = true;
        location.reload();
      }, 500);
    }, 6000);
  }

  function fetchUpdates() {
    return fetch('./updates.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) return null;
        return response.json();
      })
      .catch(function () { return null; });
  }

  function waitForWaiting(reg, timeout) {
    return new Promise(function (resolve) {
      if (reg.waiting) return resolve(true);
      var started = Date.now();
      var timer = setInterval(function () {
        if (reg.waiting) {
          clearInterval(timer);
          resolve(true);
          return;
        }
        if (Date.now() - started >= timeout) {
          clearInterval(timer);
          resolve(false);
        }
      }, 200);
    });
  }

  function checkForUpdate() {
    if (!registration) return Promise.resolve({ status: 'unsupported' });
    return registration.update().then(function () {
      if (registration.waiting) return true;
      if (!registration.installing) {
        return new Promise(function (resolve) { setTimeout(resolve, 300); }).then(function () {
          return !!(registration.waiting || registration.installing);
        });
      }
      return waitForWaiting(registration, 4000);
    }).then(function (waiting) {
      return fetchUpdates().then(function (data) {
        var appVersion = data && (data.appVersion || data.version || data.latest);
        var buildChanged = IS_DEV && APP_BUILD && data && data.date && data.date !== APP_BUILD;
        if (waiting && (buildChanged || (appVersion && appVersion !== APP_VERSION))) {
          render(data);
          return { status: 'available' };
        }
        if (waiting && !data) {
          // 拉不到更新说明时宁可静默等待，不能把不确定的等待 SW 当成代码更新弹窗。
          return { status: 'pending' };
        }
        if (buildChanged) {
          // Dev 预览即使只改文档/数据也提示新构建；没有 waiting SW 时点击更新会直接刷新。
          render(data);
          return { status: 'available' };
        }
        if (appVersion && appVersion !== APP_VERSION) {
          return { status: 'pending' };
        }
        return { status: 'latest' };
      });
    }).catch(function () {
      return { status: 'error' };
    });
  }

  function announce() {
    fetchUpdates().then(function (data) {
      if (!data) return;
      var appVersion = data.appVersion || data.version;
      var buildChanged = IS_DEV && APP_BUILD && data.date && data.date !== APP_BUILD;
      if ((!appVersion || appVersion === APP_VERSION) && !buildChanged) return;
      try {
        if (sessionStorage.getItem('pwa-later:' + (data.latest || appVersion))) return;
      } catch (e) { /* ignore */ }
      render(data);
    });
  }

  navigator.serviceWorker.addEventListener('controllerchange', function () {
    if (!updating || reloading) return;
    setProgress(100, '更新完成，正在刷新…');
    setTimeout(function () {
      if (reloading) return;
      reloading = true;
      location.reload();
    }, 700);
  });

  navigator.serviceWorker.register('./sw.js', {
    scope: './',
    updateViaCache: 'none'
  }).then(function (reg) {
    registration = reg;

    if (reg.waiting) announce();

    reg.addEventListener('updatefound', function () {
      var installing = reg.installing;
      if (!installing) return;
      installing.addEventListener('statechange', function () {
        if (installing.state === 'installed' && navigator.serviceWorker.controller) {
          announce();
        }
      });
    });

    // 兜底：部分浏览器在 register 返回前就完成安装。
    setTimeout(function () {
      if (reg.waiting) announce();
    }, 3000);

    setTimeout(function () {
      reg.update().catch(function () { /* ignore */ });
    }, 1200);

    setInterval(function () {
      reg.update().catch(function () { /* ignore */ });
    }, 15 * 60 * 1000);

    window.__JX3_PWA__ = {
      registration: reg,
      announce: announce,
      check: checkForUpdate
    };
  }).catch(function (error) {
    if (window.console) console.warn('[pwa] service worker registration failed', error);
  });

  document.addEventListener('visibilitychange', function () {
    if (!document.hidden && registration) {
      registration.update().catch(function () { /* ignore */ });
    }
  });
})();
