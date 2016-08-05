define(function(require, exports, module) {
  'use strict';

  module.exports = function repeat(count, operation) {
    return operation().then(function() {
        if (--count <= 0) {
          return;
        }
        return repeat(count, operation);
      });
  };
});
