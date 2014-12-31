var error = require('../error');
var utils = require('../common');
var ipRegex = require('ip-regex');

var formats = {
  // email address
  email:  /^.+@.+\..+$/i,
  // uuids
  uuid:   /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv1: /^[a-f0-9]{8}-[a-f0-9]{4}-1[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv2: /^[a-f0-9]{8}-[a-f0-9]{4}-2[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv3: /^[a-f0-9]{8}-[a-f0-9]{4}-3[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv4: /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv5: /^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  // ip addresses
  ip:   {test: function (str) { return ipRegex({exact: true}).test(str);}},
  ipv4: {test: function (str) { return ipRegex.v4({exact: true}).test(str);}},
  ipv6: {test: function (str) { return ipRegex.v6({exact: true}).test(str);}},
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

module.exports = function getStringValidator(namespace, schema, definitions, engine) {
  return stringValidator(namespace, schema, definitions, engine);
};
