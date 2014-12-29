var engine = require('./engine');

module.exports.validate = function adhere(val, schema) {
  return engine.validate(val, schema, {});
};
