define(function(require, exports, module) {
  'use strict';
  var until = require('./until');

  module.exports = function repeat(count, operation) {
    return until(operation, function() { return --count <= 0; });
  };
});
