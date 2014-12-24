var error = require('./error');
var merge = require('mout/object/merge');
var validators = require('./validators');

function validate(val, schema, definitions, namespace, parent) {
  // root namespace is demarked as dollar
  namespace = namespace || '$';

  // augment definitions with local schema definitions
  definitions = merge(definitions, schema.definitions);

  var types = !schema.type ? undefined :
    Array.isArray(schema.type) ? schema.type :
    [schema.type];

  if (types === undefined) {
    return {
      valid: false,
      errors: [error(namespace, schema, 'type', val, 'schema error: no type provided')]
    };
  }

  // test types and settle on a validator
  var validator = types.reduce(function (memo, type) {
    if (memo !== null) return memo;
    if (!validators[type]) return memo;

    var validator = validators[type](namespace, schema, definitions, module.exports);

    // must satisfy all type checkers
    var satisfiesType = validator.typeCheckers.reduce(function (memo, checker) {
      return memo && checker(val);
    }, true);

    if (satisfiesType) return validator;
    return memo;
  }, null);

  if (validator === null) {
    return {
      valid: false,
      errors: [error(namespace, schema, 'type', val)]
    };
  }

  // test enum
  // use validator's custom comparator, if provided
  // use strict equality otherwise
  if (schema.enum) {
    var comparator = validator.comparator || function (a, b) { return a === b; };

    // must satisfy at least one enum
    var satisfiesEnum = schema.enum.reduce(function(memo, enumElement) {
      return memo || comparator(val, enumElement);
    }, false);

    if (!satisfiesEnum) {
      return {
        valid: false,
        errors: [error(namespace, schema, 'enum', val)]
      };
    }
  }

  // test conform, if necessary
  if (schema.conform) {
    var satisfyConform = schema.conform(val, parent);

    if (!satisfyConform) {
      return {
        valid: false,
        errors: [error(namespace, schema, 'conform', val)]
      };
    }
  }

  // test allOf
  if (schema.allOf) {
    var satisfied = [];
    var satisfiesAllOf = schema.allOf.reduce(function (memo, schema) {
      var result = validate(val, schema, definitions);
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
      return memo || validate(val, schema, definitions).valid;
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
      if (validate(val, schema, definitions).valid) memo = memo + 1;
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
    var satisfiesNot = !validate(val, schema.not, definitions).valid;

    if (!satisfiesNot) {
      return {
        valid: false,
        errors: [error(namespace, schema, 'not', val)]
      };
    }
  }

  return validator(val);
}
module.exports.validate = validate;
