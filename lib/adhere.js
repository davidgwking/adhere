var utils = require('./common');
var engine = require('./engine');
var formats = require('./formats');

module.exports.validate = function adhere(val, schema) {
  return engine.validate(val, schema, {});
};

module.exports.injectFormat = function injectFormat(name, re) {
  if (!name || !utils.isString(name) || !re || !re.test) return false;

  formats[name] = re;
  return true;
};
