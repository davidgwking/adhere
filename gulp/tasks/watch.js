var gulp = require('gulp');
var constants = require('../constants');

module.exports = function() {
  gulp.watch(constants.WATCHABLE, ['test']);
};
