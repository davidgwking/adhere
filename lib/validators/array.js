var error = require('../error');
var utils = require('../common');
var merge = require('mout/object/merge');
var unique = require('mout/array/unique');
var deepEquals = require('mout/lang/deepEquals');

function arrayValidator(namespace, schema, definitions, engine) {
  var errors = [];
  var valid = true;

  function validatorFn(arr) {
    items(arr);

    if (schema.minItems !== undefined) minItems(arr);
    if (schema.maxItems !== undefined) maxItems(arr);
    if (schema.uniqueItems !== undefined) uniqueItems(arr);

    return {valid: valid, errors: errors};
  }

  validatorFn.typeCheckers = [utils.isArray];

  validatorFn.comparator = function comparator(a, b) {
    return deepEquals(a, b);
  };

  function items(arr) {
    var schemas = schema.items;

    if (schemas === undefined) return;

    // array of schemas
    if (Array.isArray(schemas)) {
      schemas.forEach(function (schema, index) {
        if (arr[index] === undefined) {
          valid = valid && false;
          errors.push(error(namespace, schema, 'items', index));
        }
      });

      arr.forEach(function (val, index) {
        var result;
        if (schemas[index] === undefined) {
          // additionalItems defaults to true
          if (schema.additionalItems !== false) return;
          result = {
            valid: false,
            errors: [error(namespace, schema, 'additionalItems', index)]
          };
        }
        else {
          var resolvedSchema = utils.resolveSubschema(schemas[index], definitions);
          result = engine.validate(val, resolvedSchema, definitions, [namespace, index].join('.'), arr);
        }

        valid = valid && result.valid;
        errors = errors.concat(result.errors);
      });
      return;
    }

    // single schema
    var schm = schemas;
    arr.forEach(function (val, index) {
      // validate inner object
      var resolvedSchema = utils.resolveSubschema(schm, definitions);
      var result = engine.validate(val, resolvedSchema, definitions, [namespace, index].join('.'), arr);

      valid = valid && result.valid;
      errors = errors.concat(result.errors);
    });
  }

  function maxItems(arr) {
    if (arr.length > schema.maxItems) {
      valid = false;
      errors.push(error(namespace, schema, 'maxItems', arr.length));
    }
  }

  function minItems(arr) {
    if (arr.length < schema.minItems) {
      valid = false;
      errors.push(error(namespace, schema, 'minItems', arr.length));
    }
  }

  function uniqueItems(arr) {
    if (unique(arr, validatorFn.comparator).length !== arr.length) {
      valid = false;
      errors.push(error(namespace, schema, 'uniqueItems', arr));
    }
  }

  return validatorFn;
}

module.exports = function getArrayValidator(namespace, schema, definitions, engine) {
  return arrayValidator(namespace, schema, definitions, engine);
};
