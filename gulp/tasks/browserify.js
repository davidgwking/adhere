var gulp = require('gulp');
var uglify = require('gulp-uglify');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var constants = require('../constants');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');

module.exports = function() {
  var bundler = browserify({
    entries: [constants.PACKAGE.main],
    debug: true
  });
  var bundle = function() {
    var bundleName = constants.PACKAGE_NAME;
    return bundler
    .bundle()
    .pipe(source(bundleName))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(constants.BROWSERIFY_OUT));
  };
  return bundle();
};
