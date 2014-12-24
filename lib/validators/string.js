var error = require('../error');
var utils = require('../common');

function stringValidator(namespace, schema) {
  var errors = [];
  var valid = true;

  function validatorFn(str) {
    if (schema.maxLength) maxLength(str);
    if (schema.minLength) minLength(str);
    if (schema.pattern) pattern(str);

    return {valid: valid, errors: errors};
  }

  validatorFn.typeCheckers = [utils.isString];

  function maxLength(str) {
    if (str.length > schema.maxLength) {
      valid = false;
      errors.push(error(namespace, schema, 'maxLength', str.length));
    }
  }

  function minLength(str) {
    if (str.length < schema.minLength) {
      valid = false;
      errors.push(error(namespace, schema, 'minLength', str.length));
    }
  }

  function pattern(str) {
    var re;
    if (utils.isString(schema.pattern)) re = utils.patternStrToRegExp(schema.pattern);
    else re = schema.pattern;

    var satisfy = re.test(str);
    if (!satisfy) {
      valid = false;
      errors.push(error(namespace, schema, 'pattern', str));
    }
  }

  return validatorFn;
}

module.exports = function getStringValidator(namespace, schema, definitions, engine) {
  return stringValidator(namespace, schema, definitions, engine);
};
