var util = require('util');
var utils = require('../common');
var NumberValidator = require('./number');

function IntegerValidator(namespace, schema, engine) {
  NumberValidator.call(this, namespace, schema, engine);

  this.typeCheckers.push(utils.isInteger);
}
util.inherits(IntegerValidator, NumberValidator);
module.exports = IntegerValidator;
