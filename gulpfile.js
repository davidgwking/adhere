// parse command line options
var knownOptions = {
  string: 'browsers',
  default: { browsers: 'Firefox,Chrome,PhantomJS' }
};
module.exports.argv = require('minimist')(process.argv.slice(2), knownOptions);
module.exports.argv.browsers = module.exports.argv.browsers.split(',').map(function (s) {return s.trim();});

// register tasks
var gulp = require('./gulp')([
  'browserify',
  'clean',
  'coverage',
  'lint',
  'test',
  'test-browser',
  'watch'
]);

gulp.task('default', ['clean', 'lint', 'test']);
gulp.task('travis', ['clean', 'lint', 'coverage', 'test-browser']);
