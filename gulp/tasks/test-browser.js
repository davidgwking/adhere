var karma = require('karma').server;
var argv = require('../../gulpfile').argv;

module.exports = function (done) {
  karma.start({
    configFile: __dirname + '/../../karma.conf.js',
    browsers: argv.browsers
  }, done);
};
