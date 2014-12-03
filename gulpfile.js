var gulp = require('gulp');
var del = require('del');
var mocha = require('gulp-mocha');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var istanbul = require('gulp-istanbul');
var stylish = require('jshint-stylish');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');

// constants
var PACKAGE = require('./package.json');
var PACKAGE_NAME = PACKAGE.version + '.' + PACKAGE.name + '.' + 'min.js';
var TESTS = 'test/**/*.js';
var SOURCE = 'lib/**/*.js';
var CLEANABLE = ['dist', 'coverage'];
var LINTABLE = ['gulpfile.js', SOURCE, TESTS];
var WATCHABLE = ['lib/**', 'test/**'];

// task globals
var MOCHA_REPORTER = 'min';
var BROWSERIFY_OUT = './dist/js';
var COVERAGE_OUT = './coverage';
var COVERAGE_REPORTERS = ['lcovonly', 'text', 'text-summary'];

// tasks
gulp.task('default', ['test']);

gulp.task('watch', function() {
  gulp.watch(WATCHABLE, ['test']);
});

gulp.task('clean', function(cb) {
  del(CLEANABLE, cb);
});

gulp.task('lint', function() {
  return gulp.src(LINTABLE)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail')); // fail task on lint failure
});

gulp.task('test', ['clean', 'lint'], function() {
  return gulp.src([TESTS], {read: false})
    .pipe(mocha({reporter: MOCHA_REPORTER, 'ignoreLeaks': false}));
});

gulp.task('test-coverage', ['clean', 'lint'], function(cb) {
  gulp.src([SOURCE])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src([TESTS])
        .pipe(mocha({reporter: MOCHA_REPORTER, 'ignoreLeaks': false}))
        .pipe(istanbul.writeReports({dir: COVERAGE_OUT, reporters: COVERAGE_REPORTERS}))
        .once('end', cb);
    });
});

gulp.task('browserify', ['clean', 'lint', 'test'], function() {
  var bundler = browserify({
    entries: [PACKAGE.main],
    debug: true
  });
  var bundle = function() {
    var bundleName = PACKAGE_NAME;
    return bundler
      .bundle()
      .pipe(source(bundleName))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(uglify())
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest(BROWSERIFY_OUT));
  };
  return bundle();
});

// browserify the code
// run tests in node and the browser
// minify the browser code
// run other tasks like linting
