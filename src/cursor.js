define(function(require, exports, module) {
  'use strict';
  var pause = require('./util/pause');
  var until = require('./util/until');

  function Cursor(color, period) {
    this.el = document.createElement('span');
    this.el.innerHTML = '&nbsp;';
    this.color(color);
    this.period(period);
    this._blinking = false;
    this._stopRequests = 0;

    this.show();
  }

  Cursor.prototype.show = function() {
    this.el.style.display = 'inline';
    this._blink();
  };

  Cursor.prototype.hide = function() {
    this.el.style.display = 'none';
    if (this._blinking) {
      this._blinking = false;
      this._stopRequests += 1;
    }
  };

  Cursor.prototype.color = function(value) {
    this.el.style.backgroundColor = value;
  };

  Cursor.prototype.period = function(value) {
    this._period = value;
  };

  Cursor.prototype._blink = function() {
    var visibility;
    if (this._blinking) {
      return;
    }

    this._blinking = true;

    until(function() {
      visibility = visibility === 'visible' ? 'hidden' : 'visible';
      this.el.style.visibility = visibility;
      return pause(this._period);
    }.bind(this), function() {
      if (this._stopRequests) {
        this._stopRequests -= 1;
        return true;
      }
    }.bind(this));
  };

  module.exports = Cursor;
});
