var minimist = require('minimist');

/**
 * parse cli options
 */
var knownOptions = {string: 'browsers'};
module.exports.argv = minimist(process.argv.slice(2), knownOptions);

/**
 * browser executable detection
 */
function getBrowsers() {
  if (module.exports.argv.browsers)
    return module.exports.argv.browsers.split(',').map(function (b) {return b.trim();});

  var browsers = ['PhantomJS']; // always test against phantom
  if (process.env.CHROME_BIN) browsers.push('Chrome');
  if (process.env.SAFARI_BIN) browsers.push('Safari');
  if (process.env.FIREFOX_BIN) browsers.push('Firefox');
  if (process.env.IE_BIN) browsers.push('IE');
  if (process.env.OPERA_BIN) browsers.push('Opera');
  return browsers;
}
module.exports.argv.browsers = getBrowsers();

/**
 * register tasks
 */
var runSequence = require('run-sequence');
var gulp = require('./gulp')([
  'browserify',
  'clean',
  'coverage',
  'lint',
  'test',
  'test-browser',
  'test-browser-remote',
  'watch'
]);

gulp.task('default', function (cb) {
  runSequence('lint', 'test', cb);
});

gulp.task('travis', function (cb) {
  runSequence('lint', 'coverage', 'test-browser-remote', cb);
});
