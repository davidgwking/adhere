// constants
var PACKAGE = module.exports.PACKAGE = require('../package.json');
module.exports.PACKAGE_NAME = PACKAGE.version + '.' + PACKAGE.name + '.' + 'min.js';
var TESTS = module.exports.TESTS = 'test/**/*.js';
var SOURCE = module.exports.SOURCE = 'lib/**/*.js';
module.exports.CLEANABLE = ['dist', 'coverage'];
module.exports.LINTABLE = ['gulpfile.js', 'gulp/**/*.js', SOURCE, TESTS];
module.exports.WATCHABLE = ['lib/**', 'test/**'];

// task globals
module.exports.MOCHA_REPORTER = 'min';
module.exports.BROWSERIFY_OUT = './dist/js';
module.exports.COVERAGE_OUT = './coverage';
module.exports.COVERAGE_REPORTERS = ['lcovonly', 'text', 'text-summary'];
