module.exports = function(config) {
  config.set({
    frameworks: ['browserify', 'mocha'],

    files: [
      'test/**/*.js'
    ],

    // saucelabs reporter must be used or saucelabs won't report outcome
    reporters: ['dots', 'saucelabs'],

    preprocessors: {
      'test/**/*.js': ['browserify']
    },

    logLevel: 'LOG_DEBUG',

    singleRun: true,
    autoWatch: false,

    browserify: {
      debug: true
    }

  });
};
