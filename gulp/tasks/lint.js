var gulp = require('gulp');
var jshint = require('gulp-jshint');
var constants = require('../constants');
var stylish = require('jshint-stylish');

module.exports = function() {
  return gulp.src(constants.LINTABLE)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(jshint.reporter('fail')); // fail task on lint failure
};
