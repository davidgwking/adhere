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

  if (divisor === 0) {
    this.valid = false;
    this.errors.push([this.namespace, 'cannot multiple of zero'].join(': '));
  }

  var valid = num % divisor === 0;

  if (!valid) {
    this.valid = false;
    this.errors.push([this.namespace, 'value ' + num + ' not multiple of ' + divisor].join(': '));
  }
};

NumberValidator.prototype.maximum = function maximum(num) {
  var valid = this.schema.exclusiveMaximum ? num < this.schema.maximum : num <= this.schema.maximum;

  if (!valid) {
    this.valid = false;
    this.errors.push([this.namespace, 'value ' + num + ' violates maximum ' + this.schema.maximum].join(': '));
  }
};

NumberValidator.prototype.minimum = function minimum(num) {
  var valid = this.schema.exclusiveMinimum ? num > this.schema.minimum : num >= this.schema.minimum;

  if (!valid) {
    this.valid = false;
    this.errors.push([this.namespace, 'value ' + num + ' violates minimum ' + this.schema.maximum].join(': '));
  }
};
