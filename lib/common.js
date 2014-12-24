var merge = require('mout/object/merge');

var REFS_KEYWORD = '$ref';
module.exports.resolveSubschema = function resolveSubschema(subschema, definitions) {
  subschema = subschema || {};
  definitions = merge(definitions, subschema.definitions);

  var reference = subschema[REFS_KEYWORD];
  if (!reference) return subschema;

  var trimmedReference = reference.slice(1);
  if (definitions[trimmedReference]) return definitions[trimmedReference];

  return {};
};

module.exports.isObject = function isObject(val) {
  return typeof val === 'object' && val !== null &&  !Array.isArray(val) &&
    !(val instanceof RegExp) && !(val instanceof Date);
};

module.exports.isNumber = function isNumber(val) {
  return typeof val === 'number' && !isNaN(val);
};

module.exports.isInteger = function isInteger(int) {
  return int % 1 === 0;
};

module.exports.isNull = function isNull(nul) {
  return nul === null;
};

module.exports.isBoolean = function isBoolean(bool) {
  return typeof bool === 'boolean';
};

module.exports.isString = function isString(str) {
  return typeof str === 'string';
};

module.exports.isArray = function isArray(arr) {
  return Array.isArray(arr);
};

module.exports.patternStrToRegExp = function patternStrToRegExp(patternStr) {
  return new RegExp(patternStr);
};
