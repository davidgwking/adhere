var utils = require('../common');

function nullValidator() {
  var errors = [];
  var valid = true;

  function validatorFn() {
    return {valid: valid, errors: errors};
  }

  validatorFn.typeCheckers = [utils.isNull];

  return validatorFn;
}

module.exports = function getNullValidator(namespace, schema, definitions, engine) {
  return nullValidator(namespace, schema, definitions, engine);
};
