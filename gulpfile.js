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
