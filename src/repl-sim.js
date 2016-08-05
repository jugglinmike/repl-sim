define(function(require, exports, module) {
  'use strict';
  var pause = require('./util/pause');
  var repeat = require('./util/repeat');
  var blinkElement = require('./util/blink-element');
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
    repeatCount: 1
  };
  function typeIt(el, text, keystrokeDelay) {
    var letters = text.split('');

    return letters.reduce(function(previous, letter) {
      return previous.then(function() {
          return new Promise(function(resolve) {
              setTimeout(function() {
                el.textContent += letter;
                resolve();
              }, keystrokeDelay());
            });
        });
    }, Promise.resolve());
  }

  function animate(el, cursorNode, readDelay, submitDelay, keystrokeDelay, lines) {
    el.innerHTML = '';
    el.appendChild(cursorNode);
    var stopNode = document.createElement('button');
    innerText.set(stopNode, 'Stop');
    el.appendChild(stopNode);

    return lines.reduce(function(previous, line, idx) {
      return previous.then(function() {
        var div = document.createElement('pre');
        el.insertBefore(div, cursorNode);
        if ('output' in line) {
          cursorNode.style.display = 'none';
          innerText.set(div, line.output);
          return;
        }
        cursorNode.style.display = 'inline';
        innerText.set(div, line.prompt);
        div.style.display = 'inline';
        return pause(readDelay)
          .then(function() {
            return typeIt(div, line.input, keystrokeDelay);
          })
          .then(function() {
            return pause(submitDelay);
          })
          .then(function() {
            if (idx < lines.length -1 ) {
              div.style.display = 'block';
            }
          });
      });
    }, Promise.resolve());
  }

  function terminal(el, options) {
    var promptRe = options && options.promptRe || defaults.promptRe;
    var cursorPeriod = options && options.cursorPeriod || defaults.cursorPeriod;
    var submitDelay = options && options.submitDelay;
    var getHeight = options && options.getHeight || defaults.getHeight;
    var keystrokeDelay = options && options.keystrokeDelay || defaults.keystrokeDelay;

    if (typeof submitDelay !== 'number') {
      submitDelay = defaults.submitDelay;
    }
    var readDelay = options && options.readDelay;
    if (typeof readDelay !== 'number') {
      readDelay = defaults.readDelay;
    }
    var repeatCount = options && options.repeatCount;
    if (typeof repeatCount !== 'number') {
      repeatCount = defaults.repeatCount;
    }
    var code = innerText.get(el) || '';
    var lines = code.split('\n');

    var cursorNode = document.createElement('span');
    cursorNode.innerHTML = '&nbsp;';
    cursorNode.style.backgroundColor = getComputedStyle(el).color;
    blinkElement(cursorNode, cursorPeriod);

    var lines2 = lines.map(function(line) {
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

    el.style.height = getHeight(el) + 'px';
    repeat(repeatCount, function() {
        return animate(el, cursorNode, readDelay, submitDelay, keystrokeDelay, lines2);
      });
  }
  module.exports = terminal;
});
