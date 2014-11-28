var utils = require('../common');

function StringValidator(namespace, schema, engine) {
  this.namespace = namespace;
  this.schema = schema;
  this.engine = engine;
  this.typeCheckers = [utils.isString];

  this.errors = [];
  this.valid = true;
}
module.exports = StringValidator;

StringValidator.prototype.validate = function validate(str) {
  if (this.schema.maxLength) this.maxLength(str);
  if (this.schema.minLength) this.minLength(str);
  if (this.schema.pattern) this.pattern(str);

  return {valid: this.valid, errors: this.errors};
};

StringValidator.prototype.maxLength = function maxLength(str) {
  if (str.length > this.schema.maxLength) {
    this.valid = false;
    this.errors.push([this.namespace, 'violates maximum length ' + this.schema.maxLength].join(': '));
  }
};

StringValidator.prototype.minLength = function maxLength(str) {
  if (str.length < this.schema.minLength) {
    this.valid = false;
    this.errors.push([this.namespace, 'violates minimum length ' + this.schema.maxLength].join(': '));
  }
};

StringValidator.prototype.pattern = function maxLength(str) {
  var re;
  if (utils.isString(this.schema.pattern)) re = new RegExp(this.schema.pattern);
  else re = this.schema.pattern;

  var valid = re.test(str);
  if (!valid) {
    this.valid = false;
    this.errors.push([this.namespace, 'does not satisfy pattern'].join(': '));
  }
};
