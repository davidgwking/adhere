var del = require('del');
var constants = require('../constants');

module.exports = function(cb) {
  del(constants.CLEANABLE, cb);
};
