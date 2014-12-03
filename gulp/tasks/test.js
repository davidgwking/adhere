var gulp = require('gulp');
var mocha = require('gulp-mocha');
var constants = require('../constants');

module.exports = function() {
  return gulp.src([constants.TESTS], {read: false})
    .pipe(mocha({reporter: constants.MOCHA_REPORTER, ignoreLeaks: false}));
};
