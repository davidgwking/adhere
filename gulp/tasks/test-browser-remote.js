var karma = require('karma').server;

var sauceLabsTests = {
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
  },
  slSafari: {
    base: 'SauceLabs',
    browserName: 'iphone',
    platform: 'OS X 10.9',
    version: '7.1'
  },
  slIE11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '11'
  },
  slIE11Win8: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11'
  },
  slIE10: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '10'
  },
  slIE9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9'
  }
};

module.exports = function (done) {
  karma.start({
    configFile: __dirname + '/../../karma.conf.js',
    browsers: Object.keys(sauceLabsTests),
    customLaunchers: sauceLabsTests
  }, done);
};
