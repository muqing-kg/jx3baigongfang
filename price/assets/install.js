/* iOS 添加到桌面引导：Safari 没有可供网页调用的“安装”API，只能引导用户走分享菜单。 */
(function () {
  'use strict';

  var ua = navigator.userAgent || '';
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isStandalone = navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
  var isInApp = /MicroMessenger|XiaoHongShu|Weibo|QQ\/|AlipayClient|FBAN|FBAV|Instagram|Line\//i.test(ua);
  var isOtherIOSBrowser = /CriOS|FxiOS|EdgiOS|OPiOS|Chrome|Firefox/i.test(ua);
  var isSafari = /Safari/i.test(ua) && !isOtherIOSBrowser && !isInApp;
  var isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  var KEY = 'jx3-pwa-install-hint-v1';
  var current = null;

  function remove() {
    if (current && current.parentNode) current.parentNode.removeChild(current);
    current = null;
  }

  function message() {
    if (isInApp) {
      return '当前是 App 内置浏览器，不能添加到主屏幕。请点右上角 <b>「…」→ 在 Safari 中打开</b>，再按下面的步骤添加。';
    }
    if (!isSafari) {
      return 'iOS 只有 <b>Safari</b> 支持“添加到主屏幕”。请复制当前链接，在 Safari 中打开后重试。';
    }
    if (!isSecure) {
      return '当前是 HTTP 地址。iOS 需要 <b>HTTPS</b> 才能稳定安装为桌面应用；局域网 http 地址通常无法添加，请使用 GitHub Pages / HTTPS 域名。';
    }
    return '点 Safari 底部的 <span class="pwa-install__share">□↑</span> 分享按钮，向下滑找到 <b>「添加到主屏幕」</b>，再点右上角「添加」。如果菜单里没有：请确认不是私密浏览、Safari 未被屏幕使用时间限制，并更新 iOS。';
  }

  function show(force) {
    if (!isIOS || isStandalone) return;
    try { if (!force && sessionStorage.getItem(KEY) === '1') return; } catch (e) { /* ignore */ }
    remove();
    var root = document.createElement('div');
    root.className = 'pwa-install';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-label', '添加到桌面');
    root.innerHTML =
      '<div class="pwa-install__head">' +
        '<span class="pwa-install__title">安装到桌面</span>' +
        '<button type="button" class="pwa-install__close" aria-label="关闭">×</button>' +
      '</div>' +
      '<div class="pwa-install__body">' + message() + '</div>' +
      '<div class="pwa-install__actions"><button type="button" class="pwa-install__ok">知道了</button></div>';
    root.querySelector('.pwa-install__close').addEventListener('click', dismiss);
    root.querySelector('.pwa-install__ok').addEventListener('click', dismiss);
    document.body.appendChild(root);
    current = root;
    function dismiss() {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* ignore */ }
      remove();
    }
  }

  window.__showInstallGuide = function (force) { show(force === true); };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(function () { show(false); }, 700); });
  } else {
    setTimeout(function () { show(false); }, 700);
  }
}());
