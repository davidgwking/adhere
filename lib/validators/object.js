var error = require('../error');
var utils = require('../common');
var merge = require('mout/object/merge');
var deepEquals = require('mout/lang/deepEquals');
var difference = require('mout/array/difference');

function objectValidator(namespace, schema, definitions, engine) {
  var errors = [];
  var valid = true;
  var visitedProperties = [];
  var validProperties = [];
  var visitedRequiredSchemaProperties = [];

  function validatorFn(obj) {
    // test properties
    properties(obj);

    // test patternProperties
    patternProperties(obj);

    // test additional properties (`additionalProperties` defaults to true)
    additionalProperties(obj);

    // ensure we've visited all required properties (`required` defaults to false)
    requiredProperties(obj);

    // test min and max properties
    if (schema.maxProperties !== undefined) maxProperties(obj);
    if (schema.minProperties !== undefined) minProperties(obj);

    // test dependencies
    if (schema.dependencies !== undefined) dependencies(obj);

    // return verdict
    return {valid: valid, errors: errors};
  }

  validatorFn.typeCheckers = [utils.isObject];

  validatorFn.comparator = function comparator(a, b) {
    return deepEquals(a, b);
  };

  function additionalProperties(obj) {
    var objProps = Object.keys(obj);
    if (schema.additionalProperties === false && objProps.length > visitedProperties.length) {
      valid = false;
      difference(objProps, visitedProperties).forEach(function (extraneousProp) {
        errors.push(error(namespace, schema, 'additionalProperties', extraneousProp));
      });
    }
  }

  function requiredProperties() {
    var propsKeys = Object.keys(schema.properties || {});
    var patternPropsKeys = Object.keys(schema.patternProperties || {});

    var requiredProps = propsKeys.reduce(function (memo, property) {
      if (schema.properties[property].required === true) memo.push(property);
      return memo;
    }, []);
    var requiredPatternProperties = patternPropsKeys.reduce(function (memo, pattern) {
      if (schema.patternProperties[pattern].required === true) memo.push(pattern);
      return memo;
    }, []);

    requiredProps = requiredProps.concat(requiredPatternProperties);

    var unsatisfiedRequiredProperties = difference(requiredProps, visitedRequiredSchemaProperties);
    if (unsatisfiedRequiredProperties.length) {
      valid = false;
      var errors = unsatisfiedRequiredProperties.map(function (property) {
        return error(namespace, schema, 'required', property);
      });
      errors = errors.concat(errors);
    }
  }

  function properties(obj) {
    var props = schema.properties || {};

    Object.keys(obj).forEach(function (property) {
      // if not validatable, skip
      if (!props[property]) return;

      var matchedSchema = props[property];

      // track property as visited
      visitedProperties.push(property);

      // track required schema as visited
      if (matchedSchema.required === true)
        visitedRequiredSchemaProperties.push(property);

      // validate inner object
      var resolvedSchema = utils.resolveSubschema(matchedSchema, definitions);
      var result = engine.validate(obj[property], resolvedSchema, definitions, [namespace, property].join('.'), obj);
      if (result.valid) validProperties.push(property);
      valid = valid && result.valid;
      errors = errors.concat(result.errors);
    });
  }

  function patternProperties(obj) {
    var patternProps = schema.patternProperties || {};
    var patternStrs = Object.keys(patternProps);

    // no patterns
    if (!patternStrs.length) return;

    var regExps = patternStrs.map(utils.patternStrToRegExp);

    Object.keys(obj).forEach(function (property) {
      // let properties take precedence over pattern properties
      if (visitedProperties.indexOf(property) > -1) return;

      var matchIndex = regExps.reduce(function (memo, re, index) {
        if (memo > -1) return memo;
        else if (re.test(property)) return index;
        else return -1;
      }, -1);

      // no match found
      if (matchIndex === -1) return;

      // track property as visited
      visitedProperties.push(property);

      // track required schema as visited, if we haven't already
      var matchedPattern = patternStrs[matchIndex];
      var matchedSchema = patternProps[matchedPattern];
      if (matchedSchema.required === true && visitedRequiredSchemaProperties.indexOf(matchedPattern) === -1)
        visitedRequiredSchemaProperties.push(matchedPattern);

      // validate inner object
      var resolvedSchema = utils.resolveSubschema(matchedSchema, definitions);
      var result = engine.validate(obj[property], resolvedSchema, definitions, [namespace, property].join('.'), obj);
      if (result.valid) validProperties.push(property);
      valid = valid && result.valid;
      errors = errors.concat(result.errors);
    });
  }

  function maxProperties(obj) {
    var numProps = Object.keys(obj).length;
    if (numProps > schema.maxProperties) {
      valid = false;
      errors.push(error(namespace, schema, 'maxProperties', numProps));
    }
  }

  function minProperties(obj) {
    var numProps = Object.keys(obj).length;
    if (numProps < schema.minProperties) {
      valid = false;
      errors.push(error(namespace, schema, 'minProperties', numProps));
    }
  }

  function dependencies(obj) {
    var propsWithDeps = schema.dependencies;

    Object.keys(propsWithDeps).forEach(function (propWithDep) {
      // don't bother checking dependencies of props that aren't provided
      if (obj[propWithDep] === undefined) return;

      var ns = [namespace, propWithDep].join('.');

      // handle property deps
      var deps = propsWithDeps[propWithDep];
      if (Array.isArray(deps)) {
        var depsUnsatisfied = [];
        var depsSatisfied = deps.reduce(function (memo, dep) {
          var isSatisfied = validProperties.indexOf(dep) > -1;
          if (!isSatisfied) depsUnsatisfied.push(dep);
          return memo && isSatisfied;
        }, true);

        if (!depsSatisfied) {
          valid = false;
          errors.push(error(ns, schema, 'dependencies', difference(deps, depsUnsatisfied)));
        }

        return;
      }

      // handle schema dep
      var schemaDep = deps;
      var resolvedSchema = utils.resolveSubschema(schemaDep, definitions);
      var result = engine.validate(obj, resolvedSchema, definitions, namespace);
      if (!result.valid) {
        valid = false;
        errors.push(error(ns, schema, 'dependencies', obj));
      }
    });
  }

  return validatorFn;
}

module.exports = function getObjectValidator(namespace, schema, definitions, engine) {
  return objectValidator(namespace, schema, definitions, engine);
};
