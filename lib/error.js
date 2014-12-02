var defaultErrorMessages = {
  // array
  additionalItems: 'unexpected value at index',
  items: 'expected value at index, but found none',
  maxItems: 'value violates maximum number of items',
  minItems: 'value violates minimum number of items',
  uniqueItems: 'value violates unique items constraint',
  // number and integer
  maximum: 'value violates maximum',
  exclusiveMaximum: 'value violates exclusive maximum',
  minimum: 'value violates minimum',
  exclusiveMinimum: 'value violates exclusive minimum',
  multipleOf: 'value is not a multiple of expected value',
  // object
  additionalProperties: 'value has unexpected property',
  dependencies: 'schema dependency or dependencies are not satisfied',
  maxProperties: 'value violates maximum number of properties',
  minProperties: 'value violates minimum number of properties',
  // patternProperties: '',
  // properties: '',
  required: 'value does not have required property',
  // string
  maxLength: 'value violates maximum length',
  minLength: 'value violates minimum length',
  pattern: 'value does not satisfy pattern',
  // universal
  allOf: 'value does not satisfy all constraints',
  anyOf: 'value does not satisfy any constraint',
  conform: 'value does not conform',
  enum: 'value is not in declared enumeration',
  not: 'value satisfies schema which it should not',
  oneOf: 'value does not satisfy only one constraint',
  type: 'value does not satisfy type'
};

function error(namespace, schema, keyword, value, msg) {
  var message = msg || (schema.messages && schema.messages[keyword]) ||
    defaultErrorMessages[keyword] || 'no default message';

  return {
    namespace: namespace,
    keyword: keyword,
    actual: value,
    expected: schema[keyword],
    message: message
  };
}
module.exports = error;
