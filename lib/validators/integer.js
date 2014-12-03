var utils = require('../common');
var numberValidator = require('./number');

module.exports = function getIntegerValidator(namespace, schema, engine) {
  var numValidatorFn = numberValidator(namespace, schema, engine);
  numValidatorFn.typeCheckers.push(utils.isInteger);
  return numValidatorFn;
};
