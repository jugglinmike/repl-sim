require(['../src/repl-sim'], function(ReplSim) {
  'use strict';
  var terminals = document.getElementsByClassName('terminal');
  var config = {
    promptRe: /(^\$|C:[^>]*>|.*\u200b) /,
    cursorPeriod: 700,
    submitDelay: 800,
    readDelay: 1000,
    repeatCount: 1
  };
  var idx;

  for (idx = 0; idx < terminals.length; ++idx) {
    (function play(sim) {
      sim.play().then(play.bind(null, sim));
    }(new ReplSim(terminals[idx], config)));
  }
});
