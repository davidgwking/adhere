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
