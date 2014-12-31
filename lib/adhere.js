var utils = require('./common');
var engine = require('./engine');
var formats = require('./formats');

module.exports.validate = function adhere(val, schema) {
  return engine.validate(val, schema, {});
};

module.exports.injectFormat = function injectFormat(name, pattern) {
  if (!name || !utils.isString(name) || !pattern || !pattern.test) return false;

  formats[name] = pattern;
  return true;
};
