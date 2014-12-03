var gulp = require('./gulp')([
  'browserify',
  'clean',
  'coverage',
  'lint',
  'test',
  'watch'
]);

gulp.task('default', ['clean', 'lint', 'test']);
