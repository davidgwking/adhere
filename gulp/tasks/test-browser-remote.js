var async = require('async');
var karma = require('karma').server;

var launchers = {
  /**
   * ios
   */
   'slIphone8.1Ios10.9': {
     base: 'SauceLabs',
     browserName: 'iphone',
     platform: 'OS X 10.9',
     version: '8.1'
   },
   'slIpad8.1Ios10.9': {
     base: 'SauceLabs',
     browserName: 'ipad',
     platform: 'OS X 10.9',
     version: '8.1'
   },
   'slIphone8.0Ios10.9': {
     base: 'SauceLabs',
     browserName: 'iphone',
     platform: 'OS X 10.9',
     version: '8.0'
   },
   'slIpad8.0Ios10.9': {
     base: 'SauceLabs',
     browserName: 'ipad',
     platform: 'OS X 10.9',
     version: '8.0'
   },
   /**
    * android
    */
   'slAndroid4.4': {
     base: 'SauceLabs',
     browserName: 'android',
     platform: 'linux',
     version: '4.4'
   },
   'slAndroid4.3': {
     base: 'SauceLabs',
     browserName: 'android',
     platform: 'linux',
     version: '4.3'
   },
   'slAndroid4.2': {
     base: 'SauceLabs',
     browserName: 'android',
     platform: 'linux',
     version: '4.2'
   },
   'slAndroid4.1': {
     base: 'SauceLabs',
     browserName: 'android',
     platform: 'linux',
     version: '4.1'
   },
  /**
   * Chrome
   */
   'slChromeWin8.1': {
     base: 'SauceLabs',
     browserName: 'chrome',
     platform: 'Windows 8.1'
   },
   slChromeWin8: {
     base: 'SauceLabs',
     browserName: 'chrome',
     platform: 'Windows 8'
   },
   slChromeWin7: {
     base: 'SauceLabs',
     browserName: 'chrome',
     platform: 'Windows 7'
   },
   'slChromeYosemite': {
     base: 'SauceLabs',
     browserName: 'chrome',
     platform: 'OS X 10.10'
   },
   'slChromeMavericks': {
     base: 'SauceLabs',
     browserName: 'chrome',
     platform: 'OS X 10.9'
   },
  /**
   * Firefox
   */
   'slFirefox33Win8.1': {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 8.1',
     version: '33'
   },
   slFirefox33Win8: {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 8',
     version: '33'
   },
   slFirefox33Win7: {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 7',
     version: '33'
   },
   'slFirefox31Win8.1': {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 8.1',
     version: '31'
   },
   slFirefox31Win8: {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 8',
     version: '31'
   },
   slFirefox31Win7: {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 7',
     version: '31'
   },
   'slFirefox24Win8.1': {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 8.1',
     version: '24'
   },
   slFirefox24Win8: {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 8',
     version: '24'
   },
   slFirefox24Win7: {
     base: 'SauceLabs',
     browserName: 'firefox',
     platform: 'Windows 7',
     version: '24'
   },
  /**
   * Internet Explorer
   */
  'slIE11Win8.1': {
     base: 'SauceLabs',
     browserName: 'internet explorer',
     platform: 'Windows 8.1',
     version: '11'
   },
  slIE11Win7: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '11'
  },
  slIE10Win8: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8',
    version: '10'
  },
  slIE10Win7: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '10'
  },
  slIE9Win7: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
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
