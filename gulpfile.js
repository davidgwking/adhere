var runSequence = require('run-sequence');

// construct set of default browsers based on environment variables
var defaultBrowsers = (function (){
  var browsers = ['PhantomJS']; // always test against phantom
  if (process.env.CHROME_BIN) browsers.push('Chrome');
  if (process.env.SAFARI_BIN) browsers.push('Safari');
  if (process.env.FIREFOX_BIN) browsers.push('Firefox');
  if (process.env.OPERA_BIN) browsers.push('Opera');
  if (process.env.IE_BIN) browsers.push('IE');
  return browsers.join(',');
})();

// parse command line options
var knownOptions = {
  string: 'browsers',
  default: { browsers: defaultBrowsers }
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

gulp.task('default', function (cb) {
  runSequence('clean', 'lint', 'test', cb);
});
gulp.task('travis', function (cb) {
  runSequence('clean', 'lint', 'coverage', 'test-browser', cb);
});
gulp.task('build', function (cb) {
  runSequence('clean', 'lint', 'coverage', 'test-browser', 'browserify', cb);
});
