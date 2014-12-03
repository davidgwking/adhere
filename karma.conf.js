var BROWSERS = ['Firefox', 'PhantomJS'];
if (!process.env.TRAVIS) BROWSERS.push('Chrome');

module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],

    files: [
      'test/**/*.js'
    ],

    reporters: ['dots'],

    preprocessors: {
      'test/**/*.js': ['browserify']
    },

    browsers: BROWSERS,
    logLevel: 'LOG_DEBUG',

    singleRun: true,
    autoWatch: false,

    browserify: {
      debug: true
    }

  });
};
