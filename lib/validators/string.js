var error = require('../error');
var utils = require('../common');
var ipRegex = require('ip-regex');

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





var formats = {
  // email addresses
  email:  /^.+@.+\..+$/i,
  // uuids
  uuid:   /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv1: /^[a-f0-9]{8}-[a-f0-9]{4}-1[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv2: /^[a-f0-9]{8}-[a-f0-9]{4}-2[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv3: /^[a-f0-9]{8}-[a-f0-9]{4}-3[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv4: /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  uuidv5: /^[a-f0-9]{8}-[a-f0-9]{4}-5[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i,
  // ip addresses
  ip:   {
    test: function (str) {
      return ipRegex({exact: true}).test(str);
    }
  },
  ipv4: {
    test: function (str) {
      return ipRegex.v4({exact: true}).test(str);
    }
  },
  ipv6: {
    test: function (str) {
      return ipRegex.v6({exact: true}).test(str);
    }
  },
  // iso8601 dates and date times
  date: {
    test: function (str) {
      // basic pattern match
      var dateFmt = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
      var isMatch = dateFmt.exec(str);
      if (!isMatch) return false;
      var captured = isMatch.slice(1);
      return isDayValid(captured);
    }
  },
  'date-time': {
    test: function (str) {
      var dateTimeFmt = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(?:[01][0-9]|2[0-3])(?:\:[01235][0-9]){2}(?:\.\d{1,3})?$/;
      var isMatch = dateTimeFmt.exec(str);
      if (!isMatch) return false;
      var captured = isMatch.slice(1);
      return isDayValid(captured);
    }
  }
};

function isDayValid(captured) {
  var isLeapYear = captured[0] % 4 === 0;
  // potential leap years divisible by 100 must be divisible by 400 to be an actual leap year
  if (isLeapYear && captured[0] % 100 === 0) isLeapYear = captured[0] % 400 === 0;

  // ensure days in month are not exceeded
  var daysInMonth = {
    '01': 31,
    '02': isLeapYear ? 29 : 28,
    '03': 31,
    '04': 30,
    '05': 31,
    '06': 30,
    '07': 31,
    '08': 31,
    '09': 30,
    '10': 31,
    '11': 30,
    '12': 31
  };

  return captured[2] <= daysInMonth[captured[1]] ? true : false;
}
