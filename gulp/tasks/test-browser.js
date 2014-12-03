var karma = require('karma').server;

module.exports = function (done) {
  karma.start({
    configFile: __dirname + '/../../karma.conf.js'
  }, done);
};
