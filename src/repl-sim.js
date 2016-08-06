define(function(require, exports, module) {
  'use strict';
  var pause = require('./util/pause');
  var repeat = require('./util/repeat');
  var innerText = require('./util/inner-text');
  var blinkElement = require('./util/blink-element');
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

    return lines.reduce(function(previous, line, idx) {
      return previous.then(function() {
        var div = document.createTextNode('');
        el.insertBefore(div, cursorNode);
        if ('output' in line) {
          cursorNode.style.display = 'none';
          div.textContent = line.output + '\n';
          return;
        }
        cursorNode.style.display = 'inline';
        div.textContent = line.prompt;
        return pause(readDelay)
          .then(function() {
            return typeIt(div, line.input, keystrokeDelay);
          })
          .then(function() {
            return pause(submitDelay);
          })
          .then(function() {
            if (idx < lines.length - 1) {
              div.textContent = div.textContent + '\n';
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
    var prepText = options && options.prepText || defaults.prepText;

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
    var code = el.getAttribute('data-repl-sim');
    if (code === null) {
      el.style.height = getHeight(el) + 'px';
      code = prepText(innerText(el) || '');
      el.setAttribute('data-repl-sim', code);
    }
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

    repeat(repeatCount, function() {
        return animate(el, cursorNode, readDelay, submitDelay, keystrokeDelay, lines2);
      });
  }
  module.exports = terminal;
});
