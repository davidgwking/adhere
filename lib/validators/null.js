var utils = require('../common');

function NullValidator(namespace, schema, engine) {
  this.namespace = namespace;
  this.schema = schema;
  this.engine = engine;
  this.typeCheckers = [utils.isNull];

  this.errors = [];
  this.valid = true;
}
module.exports = NullValidator;

NullValidator.prototype.validate = function validate() {
  return {valid: this.valid, errors: this.errors};
};
