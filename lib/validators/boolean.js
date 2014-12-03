var utils = require('../common');

function booleanValidator() {
  var errors = [];
  var valid = true;

  function validatorFn() {
    return {valid: valid, errors: errors};
  }

  validatorFn.typeCheckers = [utils.isBoolean];

  return validatorFn;
}

module.exports = function getBooleanValidator(namespace, schema, engine) {
  return booleanValidator(namespace, schema, engine);
};
