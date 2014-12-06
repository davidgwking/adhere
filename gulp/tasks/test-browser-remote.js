var async = require('async');
var karma = require('karma').server;

var ieRemote = {
  slIE9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
  },
  slIE10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '10'
  },
  slIE11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '11'
  }
};

var chrRemote = {
  slChrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  }
};

var ffRemote = {
  slFirefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '30'
  }
};

module.exports = function (done) {
  // hack browsers tests so they execute serially in batches
  // karma-sauce-launcher doesn't have concurrency control
  async.auto({

    ie: function (next) {
      karma.start({
        configFile: __dirname + '/../../karma.conf.js',
        browsers: Object.keys(ieRemote),
        customLaunchers: ieRemote,
        browserNoActivityTimeout: 1000000 // sauce labs builds can queue up
      }, next);
    },

    ff: ['ie', function (next) {
      karma.start({
        configFile: __dirname + '/../../karma.conf.js',
        browsers: Object.keys(ffRemote),
        customLaunchers: ffRemote,
        browserNoActivityTimeout: 1000000 // sauce labs builds can queue up
      }, next);
    }],

    chr: ['ff', function (next) {
      karma.start({
        configFile: __dirname + '/../../karma.conf.js',
        browsers: Object.keys(chrRemote),
        customLaunchers: chrRemote,
        browserNoActivityTimeout: 1000000 // sauce labs builds can queue up
      }, next);
    }],

  }, done);
};
