var error = require('../error');
var utils = require('../common');

var formats = {
  // email address
  //email: ,
  // uuids
  //uuidv1: ,
  //uuidv2: ,
  //uuidv3: ,
  //uuidv4: ,
  //uuidv5: ,
  // ip addresses
  //ipv4: ,
  //ipv6: ,
  // iso8601 dates and date times
  //date: ,
  //date-time: ,
};

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

module.exports = function getStringValidator(namespace, schema, engine) {
  return stringValidator(namespace, schema, engine);
};
