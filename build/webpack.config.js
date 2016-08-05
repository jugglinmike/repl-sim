'use strict';
var webpack = require('webpack');

var pkg = require('../package.json');
var now = new Date();

function pad(num) {
  return (num < 10 ? '0' : '') + num;
}

var banner = [
  pkg.name + ' - v' + pkg.version,
  'License: ' + pkg.license,
  'Date: ' + now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' +
    pad(now.getDate())
].join('\n');

module.exports = {
  context: 'src',
  entry: './repl-sim',
  output: {
    // The `filename` property is over-ridden for the minified build.
    filename: 'repl-sim.js',
    library: 'replSim',
    libraryTarget: 'umd'
  },
  plugins: [
    new webpack.BannerPlugin(banner)
  ]
};
