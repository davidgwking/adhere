var validators = require('./validators');

function validate(obj, schema, namespace, parent) {
  var types = !schema.type ? undefined :
    Array.isArray(schema.type) ? schema.type :
    [schema.type];

  if (types === undefined) {
    return {
      valid: false,
      errors: [[namespace, 'no type provided for this schema'].join(': ')]
    };
  }

  // test types and settle on a validator
  var validator = types.reduce(function (memo, type) {
    if (memo !== null) return memo;
    if (!validators[type]) return memo;

    var validator = new validators[type](namespace || '$', schema, module.exports);

    // must satisfy all type checkers
    var satisfiesType = validator.typeCheckers.reduce(function (memo, checker) {
      return memo && checker(obj);
    }, true);

    if (satisfiesType) return validator;
    return memo;
  }, null);

  if (validator === null) {
    return {
      valid: false,
      errors: [[namespace, 'expected type: ' + types.join(', ')].join(': ')]
    };
  }

  // test enum
  // use validator's custom comparator, if provided
  // use strict equality otherwise
  if (schema.enum) {
    var comparator = validator.comparator || function (a, b) { return a === b; };

    // must satisfy at least one enum
    var satisfiesEnum = schema.enum.reduce(function(memo, enumElement) {
      return memo || comparator(obj, enumElement);
    }, false);

    if (!satisfiesEnum) {
      return {
        valid: false,
        errors: [[namespace, 'did not satisfy enum: ' + schema.enum.join(', ')].join(': ')]
      };
    }
  }

  // test conform, if necessary
  if (schema.conform) {
    var satisfyConform = schema.conform(obj, parent);

    if (!satisfyConform) {
      return {
        valid: false,
        errors: [[namespace, 'expected to conform'].join(': ')]
      };
    }
  }

  // test allOf
  if (schema.allOf) {
    var failed = [];
    var satisfiesAllOf = schema.allOf.reduce(function (memo, schema, index) {
      var result = validate(obj, schema);
      if (!result.valid) failed.push(index);
      return memo && result.valid;
    }, true);

    if (!satisfiesAllOf) {
      return {
        valid: false,
        errors: [[namespace, 'failed allOf constraint: ' + failed.join(', ')].join(': ')]
      };
    }
  }

  // test anyOf
  if (schema.anyOf) {
    var satisfiesAnyOf = schema.anyOf.reduce(function (memo, schema) {
      return memo || validate(obj, schema).valid;
    }, false);

    if (!satisfiesAnyOf) {
      return {
        valid: false,
        errors: [[namespace, 'failed anyOf constraint.'].join(': ')]
      };
    }
  }

  // test oneOf
  if (schema.oneOf) {
    var numSatisfied = schema.oneOf.reduce(function (memo, schema) {
      if (validate(obj, schema).valid) memo = memo + 1;
      return memo;
    }, 0);

    if (numSatisfied !== 1) {
      return {
        valid: false,
        errors: [[namespace, 'failed oneOf constraint.'].join(': ')]
      };
    }
  }

  // test not
  if (schema.not) {
    var satisfiesNot = !validate(obj, schema.not).valid;

    if (!satisfiesNot) {
      return {
        valid: false,
        errors: [[namespace, 'failed not constraint.'].join(': ')]
      };
    }
  }

  return validator.validate(obj);
}
module.exports.validate = validate;
module.exports.validators = validators;
