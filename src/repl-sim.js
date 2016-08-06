define(function(require, exports, module) {
  'use strict';
  var Cursor = require('./cursor');
  var pause = require('./util/pause');
  var innerText = require('./util/inner-text');
  var defaults = {
    promptRe: /^\$ /,
    cursorPeriod: 700,
    submitDelay: 800,
    readDelay: 1000,
    getHeight: function(el) {
      return el.clientHeight;
    },
    keystrokeDelay: function() {
      return 50 + Math.random() * 100;
    },
    prepText: function(text) {
      return text;
    }
  };

  function Simulator(el, options) {
    this.el = el;

    this.submitDelay = options && options.submitDelay;
    this.keystrokeDelay = options && options.keystrokeDelay ||
      defaults.keystrokeDelay;
    var promptRe = options && options.promptRe || defaults.promptRe;
    var prepText = options && options.prepText || defaults.prepText;
    var cursorPeriod = options && options.cursorPeriod || defaults.cursorPeriod;
    var getHeight = options && options.getHeight || defaults.getHeight;

    if (typeof this.submitDelay !== 'number') {
      this.submitDelay = defaults.submitDelay;
    }
    this.readDelay = options && options.readDelay;
    if (typeof this.readDelay !== 'number') {
      this.readDelay = defaults.readDelay;
    }
    var code = el.getAttribute('data-repl-sim');
    if (code === null) {
      this.el.style.height = getHeight(this.el) + 'px';
      code = prepText(innerText(this.el) || '');
      this.el.setAttribute('data-repl-sim', code);
    }

    this._cursor = new Cursor(getComputedStyle(this.el).color, cursorPeriod);

    this._lines = code.split('\n').map(function(line) {
      var match = line.match(promptRe);
      var prompt;

      if (!match) {
        return { output: line };
      }
      prompt = match[0];

      return {
        prompt: prompt,
        input: line.substring(prompt.length, line.length) || ''
      };
    });
  }

  Simulator.prototype.destroy = function() {
    if (this._destroyed) {
      throw new Error('ReplSim: `destroy` called on destroyed instance');
    }

    this._cursor.hide();
    this._destroyed = true;
  };

  Simulator.prototype.play = function() {
    if (this._destroyed) {
      throw new Error('ReplSim: `play` called on destroyed instance');
    }

    this.el.textContent = '';
    this.el.appendChild(this._cursor.el);

    return this._lines.reduce(function(previous, line, idx) {
      return previous.then(function() {
        var node;
        if (this._destroyed) {
          return;
        }
        node = document.createTextNode('');
        this.el.insertBefore(node, this._cursor.el);
        if ('output' in line) {
          this._cursor.hide();
          node.textContent = line.output + '\n';
          return;
        }
        this._cursor.show();
        node.textContent = line.prompt;
        return pause(this.readDelay)
          .then(function() {
            if (this._destroyed) {
              return;
            }

            return this._typeLine(node, line.input);
          }.bind(this))
          .then(function() {
            if (this._destroyed) {
              return;
            }

            return pause(this.submitDelay);
          }.bind(this))
          .then(function() {
            if (this._destroyed) {
              return;
            }
            if (idx < this._lines.length - 1) {
              node.textContent += '\n';
            }
          }.bind(this));
      }.bind(this));
    }.bind(this), Promise.resolve());
  };

  Simulator.prototype._typeLine = function(node, text) {
    var letters;

    if (this._destroyed) {
      return;
    }

    letters = text.split('');

    return letters.reduce(function(previous, letter) {
      return previous.then(function() {
          if (this._destroyed) {
            return;
          }

          return new Promise(function(resolve) {
              setTimeout(function() {
                if (!this._destroyed) {
                  node.textContent += letter;
                }
                resolve();
              }.bind(this), this.keystrokeDelay());
            }.bind(this));
        }.bind(this));
    }.bind(this), Promise.resolve());
  };

  module.exports = Simulator;
});
