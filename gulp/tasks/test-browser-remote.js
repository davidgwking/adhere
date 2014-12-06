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
};

module.exports = function (done) {
  karma.start({
    configFile: __dirname + '/../../karma.conf.js',
    browsers: Object.keys(sauceLabsTests),
    customLaunchers: sauceLabsTests,
    browserNoActivityTimeout: 1000000 // sauce labs builds can queue up
  }, done);
};
