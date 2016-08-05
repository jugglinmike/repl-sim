define(function(require, exports, module) {
  'use strict';

  module.exports = function pause(delay) {
    return new Promise(function(resolve) { setTimeout(resolve, delay); });
  };
});
