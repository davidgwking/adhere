var error = require('../error');
var utils = require('../common');

function NumberValidator(namespace, schema, engine) {
  this.namespace = namespace;
  this.schema = schema;
  this.engine = engine;
  this.typeCheckers = [utils.isNumber];

  this.errors = [];
  this.valid = true;
}
module.exports = NumberValidator;

NumberValidator.prototype.validate = function validate(num) {
  if (this.schema.multipleOf !== undefined) this.multipleOf(num);
  if (this.schema.maximum !== undefined) this.maximum(num);
  if (this.schema.minimum !== undefined) this.minimum(num);

  return {valid: this.valid, errors: this.errors};
};

NumberValidator.prototype.multipleOf = function multipleOf(num) {
  var divisor = this.schema.multipleOf;

  // TODO: ensure schema validation handles case where multipleOf is zero.
  if (divisor === 0) {
    this.valid = false;
    this.errors.push(error(this.namespace, this.schema, 'multipleOf', num, 'schema error: multiple of zero cannot be satisfied'));
    return;
  }

  var valid = num % divisor === 0;

  if (!valid) {
    this.valid = false;
    this.errors.push(error(this.namespace, this.schema, 'multipleOf', num));
  }
};

NumberValidator.prototype.maximum = function maximum(num) {
  var valid = this.schema.exclusiveMaximum ? num < this.schema.maximum : num <= this.schema.maximum;

  if (!valid) {
    this.valid = false;
    var msg = (this.schema.exclusiveMaximum && 'value violates exclusive maximum') || undefined;
    this.errors.push(error(this.namespace, this.schema, 'maximum', num, msg));
  }
};

NumberValidator.prototype.minimum = function minimum(num) {
  var valid = this.schema.exclusiveMinimum ? num > this.schema.minimum : num >= this.schema.minimum;

  if (!valid) {
    this.valid = false;
    var msg = (this.schema.exclusiveMinimum && 'value violates exclusive minimum') || undefined;
    this.errors.push(error(this.namespace, this.schema, 'minimum', num, msg));
  }
};
