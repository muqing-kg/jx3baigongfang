/* 突破升级 Web 适配；计算模型与小程序共用。 */
(function () {
  'use strict';
  if (!window.JX3Core || !window.JX3Breakthrough || !window.createJX3Breakthrough) return;
  window.JX3BT = window.createJX3Breakthrough(window.JX3Breakthrough, window.JX3Data, function () { return window.JX3Core.Store.state; });
})();
