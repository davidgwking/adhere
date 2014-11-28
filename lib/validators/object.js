var utils = require('../common');
var deepEquals = require('mout/lang/deepEquals');
var difference = require('mout/array/difference');

function ObjectValidator(namespace, schema, engine) {
  this.namespace = namespace;
  this.schema = schema;
  this.engine = engine;
  this.typeCheckers = [utils.isObject];

  this.errors = [];
  this.valid = true;

  // state
  this.visitedProperties = [];
  this.visitedRequiredSchemaProperties = [];
}
module.exports = ObjectValidator;

ObjectValidator.prototype.validate = function validate(obj) {
  // test properties
  this.properties(obj);

  // test patternProperties
  this.patternProperties(obj);

  // test additional properties (`additionalProperties` defaults to true)
  this.additionalProperties(obj);

  // ensure we've visited all required properties (`required` defaults to false)
  this.requiredProperties(obj);

  // test min and max properties
  if (this.schema.maxProperties !== undefined) this.maxProperties(obj);
  if (this.schema.minProperties !== undefined) this.minProperties(obj);

  // test dependencies
  if (this.schema.dependencies !== undefined) this.dependencies(obj);

  // return verdict
  return {valid: this.valid, errors: this.errors};
};

ObjectValidator.prototype.additionalProperties = function additionalProperties(obj) {
  var objProps = Object.keys(obj);
  if (this.schema.additionalProperties === false && objProps.length > this.visitedProperties.length) {
    this.valid = false;
    this.errors.push([this.namespace, 'no additional properties allowed: ' + difference(objProps, this.visitedProperties).join(', ')].join(': ') );
  }
};

ObjectValidator.prototype.requiredProperties = function requiredProperties() {
  var self = this;
  var propsKeys = Object.keys(this.schema.properties || {});
  var patternPropsKeys = Object.keys(this.schema.patternProperties || {});

  var requiredProps = propsKeys.reduce(function (memo, property) {
    if (self.schema.properties[property].required === true) memo.push(property);
    return memo;
  }, []);
  var requiredPatternProperties = patternPropsKeys.reduce(function (memo, pattern) {
    if (self.schema.patternProperties[pattern].required === true) memo.push(pattern);
    return memo;
  }, []);

  requiredProps = requiredProps.concat(requiredPatternProperties);

  var unsatisfiedRequiredProperties = difference(requiredProps, this.visitedRequiredSchemaProperties);
  if (unsatisfiedRequiredProperties.length) {
    this.valid = false;
    var errors = unsatisfiedRequiredProperties.map(function (property) {
      var ns = [self.namespace, property].join('.');
      return [ns, 'required property not found.'].join(': ');
    });
    this.errors = this.errors.concat(errors);
  }
};

ObjectValidator.prototype.properties = function properties(obj) {
  var self = this;
  var props = this.schema.properties || {};

  Object.keys(obj).forEach(function (property) {
    // if not validatable, skip
    if (!props[property]) return;

    var matchedSchema = props[property];

    // track property as visited
    self.visitedProperties.push(property);

    // track required schema as visited
    if (matchedSchema.required === true)
      self.visitedRequiredSchemaProperties.push(property);

    // validate inner object
    var result = self.engine.validate(obj[property], matchedSchema, [self.namespace, property].join('.'), obj);
    self.valid = self.valid && result.valid;
    self.errors = self.errors.concat(result.errors);
  });
};

ObjectValidator.prototype.comparator = function comparator(a, b) {
  return deepEquals(a, b);
};

ObjectValidator.prototype.patternProperties = function patternProperties(obj) {
  var self = this;

  var patternProps = this.schema.patternProperties || {};
  var patternStrs = Object.keys(patternProps);

  // no patterns
  if (!patternStrs.length) return;

  var regExps = patternStrs.map(utils.patternStrToRegExp);

  Object.keys(obj).forEach(function (property) {
    // let properties take precedence over pattern properties
    if (self.visitedProperties.indexOf(property) > -1) return;

    var matchIndex = regExps.reduce(function (memo, re, index) {
      if (memo > -1) return memo;
      else if (re.test(property)) return index;
      else return -1;
    }, -1);

    // no match found
    if (matchIndex === -1) return;

    // track property as visited
    self.visitedProperties.push(property);

    // track required schema as visited, if we haven't already
    var matchedPattern = patternStrs[matchIndex];
    var matchedSchema = patternProps[matchedPattern];
    if (matchedSchema.required === true && self.visitedRequiredSchemaProperties.indexOf(matchedPattern) === -1)
      self.visitedRequiredSchemaProperties.push(matchedPattern);

    // validate inner object
    var result = self.engine.validate(obj[property], matchedSchema, [self.namespace, property].join('.'), obj);
    self.valid = self.valid && result.valid;
    self.errors = self.errors.concat(result.errors);
  });
};

ObjectValidator.prototype.maxProperties = function maxProperties(obj) {
  if (Object.keys(obj).length > this.schema.maxProperties) {
    this.valid = false;
    this.errors.push([this.namespace, 'does not satisfy maxProperties ' + this.schema.maxProperties].join(': '));
  }
};

ObjectValidator.prototype.minProperties = function minProperties(obj) {
  if (Object.keys(obj).length < this.schema.minProperties) {
    this.valid = false;
    this.errors.push([this.namespace, 'does not satisfy minProperties ' + this.schema.minProperties].join(': '));
  }
};

ObjectValidator.prototype.dependencies = function dependencies(obj) {
  var self = this;
  var propsWithDeps = this.schema.dependencies;

  Object.keys(propsWithDeps).forEach(function (propWithDep) {
    // don't bother checking dependencies of props that aren't provided
    if (obj[propWithDep] === undefined) return;

    var ns = [self.namespace, propWithDep].join('.');

    // handle property deps
    var deps = propsWithDeps[propWithDep];
    if (Array.isArray(deps)) {
      var depsUnsatisfied = [];
      var depsSatisfied = deps.reduce(function (memo, dep) {
        var isSatisfied = self.visitedProperties.indexOf(dep) > -1;
        if (!isSatisfied) depsUnsatisfied.push(dep);
        return memo && isSatisfied;
      }, true);

      if (!depsSatisfied) {
        self.valid = false;
        self.errors.push([ns, 'property dependencies are not satisfied: ' + depsUnsatisfied.join(', ')].join(': '));
      }

      return;
    }

    // handle schema dep
    var schemaDep = deps;
    var result = self.engine.validate(obj, schemaDep, self.namespace);
    if (!result.valid) {
      self.valid = false;
      self.errors.push([ns, 'schema dependency is not satisfied.'].join(': '));
    }
  });
};
