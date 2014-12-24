var error = require('../error');
var utils = require('../common');

function numberValidator(namespace, schema) {
  var errors = [];
  var valid = true;

  function validatorFn(num) {
    if (schema.multipleOf !== undefined) multipleOf(num);
    if (schema.maximum !== undefined) maximum(num);
    if (schema.minimum !== undefined) minimum(num);

    return {valid: valid, errors: errors};
  }

  validatorFn.typeCheckers = [utils.isNumber];

  function multipleOf(num) {
    var divisor = schema.multipleOf;

    // TODO: ensure schema validation handles case where multipleOf is zero.
    if (divisor === 0) {
      valid = false;
      errors.push(error(namespace, schema, 'multipleOf', num, 'schema error: multiple of zero cannot be satisfied'));
      return;
    }

    valid = num % divisor === 0;
    if (!valid) errors.push(error(namespace, schema, 'multipleOf', num));
  }

  function maximum(num) {
    var satisfy = schema.exclusiveMaximum ? num < schema.maximum : num <= schema.maximum;

    if (!satisfy) {
      valid = false;
      var msg = (schema.exclusiveMaximum && 'value violates exclusive maximum') || undefined;
      errors.push(error(namespace, schema, 'maximum', num, msg));
    }
  }

  function minimum(num) {
    var satisfy = schema.exclusiveMinimum ? num > schema.minimum : num >= schema.minimum;

    if (!satisfy) {
      valid = false;
      var msg = (schema.exclusiveMinimum && 'value violates exclusive minimum') || undefined;
      errors.push(error(namespace, schema, 'minimum', num, msg));
    }
  }

  return validatorFn;
}

module.exports = function getNumberValidator(namespace, schema, definitions, engine) {
  return numberValidator(namespace, schema, definitions, engine);
};
