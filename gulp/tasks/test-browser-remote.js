var async = require('async');
var karma = require('karma').server;

var launchers = {
  slIE9Win7: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
  },
  slIE10Win7: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '10'
  },
  slIE10Win8: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  slIE11Win7: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '11'
  },
  'slIE11Win8.1': {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  slChrome39Win7: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 7',
    version: '39'
  },
  slFirefox31Win7: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '31'
  },
  slFirefox33Win7: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 7',
    version: '33'
  }
};

module.exports = function (done) {
  // hack browsers tests so they execute serially
  // karma-sauce-launcher doesn't have concurrency control and sauce oftens starts queueing
  var errors = [];
  async.eachSeries(Object.keys(launchers), function (launcher, next) {
    var configs = {};
    configs[launcher] = launchers[launcher];

    karma.start({
      configFile: __dirname + '/../../karma.conf.js',
      browsers: [launcher],
      customLaunchers: configs,
      browserNoActivityTimeout: 1000000 // sauce labs builds can queue up
    }, function (err) {
      // hack to make sure that we execute all browser tests
      if (err) errors.push(err);
      next();
    });
  }, function (err) {
    if (err) return done(err);
    // hacky, but is symptomatic of above hacks
    if (errors.length) return done(errors[1]);
    return done();
  });
};
