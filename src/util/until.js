define(function(require, exports, module) {
  'use strict';

  module.exports = function until(operation, condition) {
    return operation().then(function() {
      if (condition()) {
        return;
      }

      return until(operation, condition);
    });
  };
});
