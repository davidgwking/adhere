var utils = require('../common');
var numberValidator = require('./number');

module.exports = function getIntegerValidator(namespace, schema, definitions, engine) {
  var numValidatorFn = numberValidator(namespace, schema, definitions, engine);
  numValidatorFn.typeCheckers.push(utils.isInteger);
  return numValidatorFn;
};
