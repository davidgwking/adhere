var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var constants = require('../constants');

module.exports = function(cb) {
  gulp.src([constants.SOURCE])
    .pipe(istanbul({includeUntested: true}))
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src([constants.TESTS])
      .pipe(mocha({reporter: constants.MOCHA_REPORTER, ignoreLeaks: false}))
      .pipe(istanbul.writeReports({dir: constants.COVERAGE_OUT, reporters: constants.COVERAGE_REPORTERS}))
      .once('end', cb);
    });
};
