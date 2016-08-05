define(function(require, exports, module) {
  'use strict';
  /* global console */

  module.exports = function error(msg) {
    if (typeof console !== 'object' || typeof console.error !== 'function') {
      return;
    }
    console.error('typer.js: ' + msg);
  };
});
