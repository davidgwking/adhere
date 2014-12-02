var error = require('./error');
var validators = require('./validators');

function validate(obj, schema, namespace, parent) {
  // root namespace is demarked as dollar
  namespace = namespace || '$';

  var types = !schema.type ? undefined :
    Array.isArray(schema.type) ? schema.type :
    [schema.type];

  if (types === undefined) {
    return {
      valid: false,
      errors: [error(namespace, schema, 'type', obj, 'schema error: no type provided')]
    };
  }

  // test types and settle on a validator
  var validator = types.reduce(function (memo, type) {
    if (memo !== null) return memo;
    if (!validators[type]) return memo;

    var validator = new validators[type](namespace, schema, module.exports);

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
      errors: [error(namespace, schema, 'type', obj)]
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
        errors: [error(namespace, schema, 'enum', obj)]
      };
    }
  }

  // test conform, if necessary
  if (schema.conform) {
    var satisfyConform = schema.conform(obj, parent);

    if (!satisfyConform) {
      return {
        valid: false,
        errors: [error(namespace, schema, 'conform', obj)]
      };
    }
  }

  // test allOf
  if (schema.allOf) {
    var satisfied = [];
    var satisfiesAllOf = schema.allOf.reduce(function (memo, schema) {
      var result = validate(obj, schema);
      if (result.valid) satisfied.push(schema);
      return memo && result.valid;
    }, true);

    if (!satisfiesAllOf) {
      return {
        valid: false,
        errors: [error(namespace, schema, 'allOf', satisfied)]
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
        errors: [error(namespace, schema, 'anyOf', [])]
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
        errors: [error(namespace, schema, 'oneOf', [])]
      };
    }
  }

  // test not
  if (schema.not) {
    var satisfiesNot = !validate(obj, schema.not).valid;

    if (!satisfiesNot) {
      return {
        valid: false,
        errors: [error(namespace, schema, 'not', obj)]
      };
    }
  }

  return validator.validate(obj);
}
module.exports.validate = validate;
