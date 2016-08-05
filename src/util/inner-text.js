define(function(require, exports) {
  'use strict';
  var property = 'innerText' in document.body ? 'innerText' : 'textContent';

  exports.get = function innerText(el) {
    return el[property];
  };

  exports.set = function setInnerText(el, value) {
    el[property] = value;
    return el[property];
  };
});
