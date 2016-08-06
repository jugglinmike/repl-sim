/**
 * Based on the MIT-licensed code at:
 *
 * https://github.com/duckinator/innerText-polyfill
 */
define(function(require, exports, module) {
  'use strict';
  module.exports = function innerText(el) {
    if ('innerText' in el) {
      return el.innerText;
    }

    if (!window.getSelection) {
      throw new Error('getSelection not available');
    }

    var selection = window.getSelection();
    var ranges = [];
    var text, idx, length;

    // Save existing selections.
    for (idx = 0, length = selection.rangeCount; idx < length; ++idx) {
      ranges[idx] = selection.getRangeAt(idx);
    }

    // Deselect everything.
    selection.removeAllRanges();

    // Select `el` and all child nodes.
    selection.selectAllChildren(el);

    // Get the string representation of the selected nodes.
    text = selection.toString();

    // Deselect everything. Again.
    selection.removeAllRanges();

    // Restore all formerly existing selections.
    for (idx = 0, length = ranges.length; idx < length; ++idx) {
      selection.addRange(ranges[idx]);
    }

    return text;
  };
});
