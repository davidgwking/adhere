var utils = require('../common');

function BooleanValidator(namespace, schema, engine) {
  this.namespace = namespace;
  this.schema = schema;
  this.engine = engine;
  this.typeCheckers = [utils.isBoolean];

  this.errors = [];
  this.valid = true;
}
module.exports = BooleanValidator;

BooleanValidator.prototype.validate = function validate() {
  return {valid: this.valid, errors: this.errors};
};
