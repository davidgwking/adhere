var error = require('../error');
var utils = require('../common');
var unique = require('mout/array/unique');
var deepEquals = require('mout/lang/deepEquals');

function ArrayValidator(namespace, schema, engine) {
  this.namespace = namespace;
  this.schema = schema;
  this.engine = engine;
  this.typeCheckers = [utils.isArray];

  this.errors = [];
  this.valid = true;
}
module.exports = ArrayValidator;

ArrayValidator.prototype.validate = function validate(arr) {
  this.items(arr);

  if (this.schema.minItems !== undefined) this.minItems(arr);
  if (this.schema.maxItems !== undefined) this.maxItems(arr);
  if (this.schema.uniqueItems !== undefined) this.uniqueItems(arr);

  return {valid: this.valid, errors: this.errors};
};

ArrayValidator.prototype.comparator = function comparator(a, b) {
  return deepEquals(a, b);
};

ArrayValidator.prototype.items = function items(arr) {
  var self = this;
  var schemas = this.schema.items;

  if (schemas === undefined) return;

  // array of schemas
  if (Array.isArray(schemas)) {
    schemas.forEach(function (schema, index) {
      if (arr[index] === undefined) {
        self.valid = self.valid && false;
        self.errors.push(error(self.namespace, self.schema, 'items', index));
      }
    });

    arr.forEach(function (val, index) {
      var result;
      if (schemas[index] === undefined) {
        // additionalItems defaults to true
        if (self.schema.additionalItems !== false) return;
        result = {
          valid: false,
          errors: [error(self.namespace, self.schema, 'additionalItems', index)]
        };
      }
      else result = self.engine.validate(val, schemas[index], [self.namespace, index].join('.'), arr);

      self.valid = self.valid && result.valid;
      self.errors = self.errors.concat(result.errors);
    });
    return;
  }

  // single schema
  var schema = schemas;
  arr.forEach(function (val, index) {
    // validate inner object
    var result = self.engine.validate(val, schema, [self.namespace, index].join('.'), arr);

    self.valid = self.valid && result.valid;
    self.errors = self.errors.concat(result.errors);
  });

};

ArrayValidator.prototype.maxItems = function maxItems(arr) {
  if (arr.length > this.schema.maxItems) {
    this.valid = false;
    this.errors.push(error(this.namespace, this.schema, 'maxItems', arr.length));
  }
};

ArrayValidator.prototype.minItems = function minItems(arr) {
  if (arr.length < this.schema.minItems) {
    this.valid = false;
    this.errors.push(error(this.namespace, this.schema, 'minItems', arr.length));
  }
};

ArrayValidator.prototype.uniqueItems = function uniqueItems(arr) {
  if (unique(arr, this.comparator).length !== arr.length) {
    this.valid = false;
    this.errors.push(error(this.namespace, this.schema, 'uniqueItems', arr));
  }
};
