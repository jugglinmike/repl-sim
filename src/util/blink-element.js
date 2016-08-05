define(function(require, exports, module) {
  'use strict';
  var pause = require('./pause');

  module.exports = function blinkElement(el, period) {
    el.style.visibility = 'hidden';
    pause(period)
      .then(function() {
        el.style.visibility = 'visible';
      })
      .then(function() {
        return pause(period);
      })
      .then(function() {
        blinkElement(el, period);
      });
  };
});
