var async = require('async');
var karma = require('karma').server;

var launchers = {
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
  },
  slChrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '35'
  },
  slFirefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '30'
  }
};

module.exports = function (done) {
  // hack browsers tests so they execute serially
  // karma-sauce-launcher doesn't have concurrency control and sauce oftens starts queueing
  async.eachSeries(Object.keys(launchers), 1, function (launcher, next) {
    var configs = {};
    configs[launcher] = launchers[launcher];
    
    karma.start({
      configFile: __dirname + '/../../karma.conf.js',
      browsers: [launcher],
      customLaunchers: configs,
      browserNoActivityTimeout: 1000000 // sauce labs builds can queue up
    }, next);
  }, done);
};
