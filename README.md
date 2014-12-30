**THIS REPOSITORY IS A WORK IN PROGRESS**

# adhere
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

[![Sauce Test Status][saucelabs-image]][saucelabs-url]

*adhere* is a simple schema\-based data validator, and strives for [JSONSchema](http://json-schema.org/latest/json-schema-validation.html) compliance.

Unlike the JSONSchema specification, however, *adhere* is highly opinionated with respect to type\-defined keyword enforcement. *adhere* allows direct validation of primitive (string, number, integer, boolean), reference (array and object), and null data types against declared schemas. In addition to data validation, *adhere* plans to provide a means for validating user-defined schemas.

A simple type-agnostic validation engine provides [common validation keywords](http://json-schema.org/latest/json-schema-validation.html#anchor75). This project ships with numerous built\-in type validators that are executed by this engine.

Available types include `object`, `array`, `string`, `number`, `integer`, `boolean`, and `null`.

## Schema Composition

Schemas are objects that are expected to have a `type` property. Validation keywords are rules declarations.

There exists two types of keywords: universal and type-specific. Universal keywords (like `type`) are tested against all values. Type-specific keywords are only tested after the type of the value is determined.

Type-specific keywords allow users to declare multiple possible types for data. In the following example schema, either an `Object` or `null` would suffice. Object-specific validation rules are only applied once a value is determined to be an `Object`.

```js
{
  // value can be an object or null
  type: ['object', 'null'],
  // start: object-specific validation keywords
  properties: {
    // property `a` is expect to be a number and must exist
    a: {type: 'number', required: true}
  },
  additionalProperties: false // only property `a` is allowed
}
```

## Usage

*adhere* exports a single function, `validate`, that accepts a value and a schema and returns whether the object adhered to the schema and any errors encountered during validation.

```js
> var adhere = require('adhere');
> var schema = {type: 'object'};
> var obj = {test: true};
> adhere.validate(obj, schema);
{ valid: true, errors: [] }
```

### Errors

*adhere* returns an array of rules violations. When reporting errors, the '$' namespace refers the root of the value passed for validation.

Default error messages can be overriden via the `messages` property.

```js
> var schema =  {
  type: 'object',
  properties: {
    a: {type: 'boolean', required: true},
    c: {type: 'object', additionalProperties: false}
  },
  additionalProperties: false,
  messages: {
    additionalProperties: 'whoa, whoa, whoa. unexpected properties'
  }
};

> adhere.validate({b: false, c:{d: true}}, schema);
{ valid: false,
  errors:
  [ { namespace: '$.c',
  keyword: 'additionalProperties',
  actual: 'd',
  expected: false,
  message: 'value has unexpected property' },
  { namespace: '$',
  keyword: 'additionalProperties',
  actual: 'b',
  expected: false,
  message: 'whoa, whoa, whoa. unexpected properties' },
  { namespace: '$',
  keyword: 'required',
  actual: 'a',
  expected: undefined,
  message: 'value does not have required property' } ] }
```

### Schema Errors

  If a schema contains structural flaws, a schema error message is returned. Testing values against schemas that do not have a `type` property results in a schema error.

```js
  > adhere.validate(1, 'schema');
  { valid: false,
    errors:
    [ { namespace: '$',
    keyword: 'type',
    actual: 1,
    expected: undefined,
    message: 'schema error: no type provided' } ] }
```

### Universal Keywords

#### type

All schemas and sub-schemas must provide a `type` property. Available types include `object`, `array`, `string`, `number`, `integer`, `boolean`, and `null`.

```js
{
  type: 'object'
}
```

Alternatively, `type` can be an array of types. The first type that is matched will be used for further validation.

```js
{
  // first try object, then try array
  // if neither object nor array, value is invalid
  type: ['object', 'array']
}
```

#### enum

The value must be one of the elements within the `enum` property.

```js
{
  // value must be a number with value 1
  type: 'number', enum: [1]
}
```

#### not

The value must not satisfy this scheme.

```js
{
  // value must be a number, but must not be 1
  type: 'number', not: {type: 'number', enum: [1]}
}
```

#### conform

A function that should return a `boolean` indicating whether the value conforms to the programmatic constraints.

```js
{
  type: 'number',
  conform: function (a) {
    // valid is value is even
    return !(a % 2);
  }
}
```

If a sub-schema declares the `conform` property, the parent is passed as a second argument to the function.

```js
{
  type: 'object',
  properties: {
    a: {
      type: 'number',
      conform: function (a, parent) {
        // `a` is only valid if sibling proprety `b` is even
        return !(parent.b % 2);
      }
    },
    b: {type: 'number'}
  }
}
```

#### anyOf

Expected to be an array of schemas. The value must satisfy these schemas.

```js
{
  type: 'number',
  anyOf: [
    // value <= 10 or 20 <= value <= 100
    {type: 'number', maximum: 10},
    {type: 'number', minimum: 20, maximum: 100}
  ]
}
```

#### allOf

Expected to be an array of schemas. The value must satisfy all of the declared schemas.

```js
{
  type: 'number',
  allOf: [
    // value must be a multiple of 2 and 3
    {type: 'number', multipleOf: 2},
    {type: 'number', multipleOf: 3}
  ]
}
```

#### oneOf

Expected to be an array of schemas. The value must satisfy only one of the declared schemas

```js
{
  type: 'number',
  oneOf: [
    // value must be either a multiple of 2 or 5
    {type: 'number', multipleOf: 2},
    {type: 'number', multipleOf: 5}
  ]
}
```

#### messages

The `messages` keyword allows the user to override default error messages.

```js
{
  type: 'object',
  additionalProperties: false,
  messages: {
    additionalProperties: 'whoa, whoa, whoa. unexpected properties'
  }
}
```

### Object Keywords

#### properties

A mapping of properties to sub-schemas. Properties that are not enumerated within this dictionary will not be tested (see [additionalProperties](#additionalproperties)).

```js
var schema = {
  type: 'object',
  properties: {
    a: {type: 'null'}
  }
};

> adhere.validate({a: null, b: 'adhere'}, schema);
{ valid: true, errors: [] }
```

#### patternProperties

A mapping of regular expression pattern strings to sub-schemas. Like `properties`, pattern properties that are not enumerated within the dictionary will not be tested.

```js
{
  type: 'object',
  patternProperties: {
    '^a$': {type: 'null'}
  }
}
```

Pattern properties can be declared alongside `properties`. Any property names visited when testing `properties` will not be tested against `patternProperties` schemas, even if the name satisfies the regular expression.

```js
> var schema = {
    type: 'object',
    properties: {
      b: {type: 'null'}
    },
    patternProperties: {
      // only `a` will be tested since `b` is enumerated in
      // `properties`
      '^[ab]$': {type: 'number'}
    }
  };

> adhere.validate({a: 3, b: null}, schema);
{ valid: true, errors: [] }
```

#### required

A boolean value that indicates whether a property or pattern property must exist.

Within the context of `patternProperties`, this keyword indicates that at least one value must exist at a property name that satisfies the regular expression.

```js
{
  type: 'object',
  properties: {
    // `a` must exist
    a: {type: 'number', required: true}
  },
  patternProperties: {
    // some combo of properties `b`, `c`, and `d` must exist
    '^[bcd]$': {type: 'number', required: true}
  }
};
```

#### additionalProperties

Indicates whether unvisited properties are allowed to exist. Unvisited properties are those that are not defined in `properties` and do not match `patternProperties`. Defaults to `true`.

```js
{
  type: 'object',
  // must be an empty object
  additionalProperties: false
};
```

#### maxProperties

The maximum number of allowable properties.

```js
{
  type: 'object',
  // must have at most one property
  maxProperties: 1
};
```

#### minProperties

The minimum number of allowable properties.

```js
{
  type: 'object',
  // must have at least one property
  minProperties: 1
};
```

#### dependencies

There are two types of dependencies: **property** and **schema**. Dependencies are only tested if a value associated with the property name exists.

A **property dependency** is a mapping of property name to array of property names. The property is only valid if all of its dependencies are also valid. Property dependencies can reference patternProperties.

```js
{
  type: 'object',
  properties: {
    a: {type: 'number'},
    b: {type: 'number', enum: [1]},
    c: {type: 'number'}
  },
  dependencies: {
    // property `a` is valid only if both `b` and `c` are valid
    // only tested if `a` is provided
    a: ['b', 'c']
  }
}
```

A **schema dependency** is valid if the parent object satisfies a sub-schema.

```js
{
  type: 'object',
  properties: {
    a: {type: 'number'},
    b: {type: 'string'}
  },
  dependencies: {
    b: {
      // property `b` is only valid if `a` is 1
      // only tested if `b` is provided
      type: 'object',
      properties: {
        a: {type: 'integer', enum: [1]}
      }
    }
  }
}
```

### Array Keywords

#### items

Either a schema or an array of schemas.

If the value of `items` is a single schema, all array elements must satisfy this schema.

```js
{
  type: 'array',
  items: {
    // array of numbers
    type: 'number'
  }
}
```

Alternatively, if the value of `items` is an array of schemas, array elements are tested one-by-one against the schemas. Elements that are not enumerated will not be validated.

```js
{
  type: 'array',
  items: [
    // first element is a number and the second is null
    {type: 'number'},
    {type: 'null'}
  ]
}
```

#### additionalItems

The `additionalItems` keyword is ignored unless `items` is an array of schemas. If `false`, this keyword disallows the existence of elements that do not have an enumerated schema. Defaults to `true`.

```js
{
  type: 'array',
  items: [
    // array of one element that is a number
    {type: 'number'}
  ],
  additionalItems: true
}
```

#### maxItems

The array's length must be less than or equal to the declared value.

```js
{
  type: 'array',
  maxItems: 100
}
```

#### minItems

The array's length must be greater than or equal to the declared value.

```js
{
  type: 'array',
  minItems: 0
}
```

#### uniqueItems

If `true`, arrays with duplicate values are deemed invalid.

```js
{
  type: 'array',
  uniqueItems: true
}
```

### String Keywords

#### pattern

Either a string regular expression pattern or a regular expression object. The value must satisfy the regular expression.

```js
{
  type: 'string',
  pattern: /^adhere$/ // or '^adhere$'
}
```

#### maxLength

The string's length must be less than or equal to the declared value.

```js
{
  type: 'string',
  maxLength: 100
}
```

#### minLength

The string's length must be greater than or equal to the declared value.

```js
{
  type: 'string',
  minLength: 0
}
```

### Number and Integer Keywords

#### maximum

The number must be less than or equal to the declared value.

```js
{
  type: 'number',
  maximum: 3
}
```

Alternatively, `exclusiveMaximum` requires that the number be strictly less than the declared value.

```js
{
  type: 'number',
  maximum: 3,
  exclusiveMaximum: true
}
```

#### minimum

The number must be greater than or equal to the declared value.

```js
{
  type: 'number',
  minimum: 10
}
```

Alternatively, `exclusiveMinimum` requires that the number be strictly greater than the declared value.

```js
{
  type: 'number',
  minimum: 10,
  exclusiveMinimum: true
}
```

#### mulitipleOf

The number must be a multiple of the declared value.

```js
{
  type: 'integer',
  multipleOf: 3
}
```

If `multipleOf` is zero, *adhere* will return a schema error.

### Boolean and Null Keywords

`boolean` and `null` types do not have any type-specific keywords.


### Utility Keywords

#### $ref and definitions

As utility keywords, `$ref` and `definitions` augment the basic validation feature set with sub-schema inlining.

```js
// should validate [1, 2, [[[[[5], 4]]]], [2]]
{
  type: 'array',
  items: { '$ref': '#recursiveArrayOfPositiveIntegers' },
  definitions: {
    recursiveArrayOfPositiveIntegers: {
      type: ['array', 'number'],
      items: { '$ref': '#recursiveArrayOfPositiveIntegers' },
      minimum: 0,
      exclusiveMinimum: true
    }
  }
}
```

When an object with the `$ref` keyword is encountered where a subschema is typically expected, *adhere* will validate against the resolved schema.

If a `$ref` is encountered, but no matching `definition` is found, an empty schema is provided. In this way, an empty schema is considered the default value for an interpolated `$ref`, and will always result in validation failure (as `type` is a required property). Future work should seek to streamline the missing subschema issue, returning a schema error.

`definitions` are inherited from parent schemas, but a sub-schema can supercede its parent's `definitions`.

```js
{
  not: {
    // can resolve mySchema, mySchema2, mySchema3
    definitions: {
      mySchema: ...,
      mySchema3: ...
    }
  },
  // can resolve mySchema, mySchema2
  definitions: {
    mySchema: ...,
    mySchema2: ...
  }
}
```

## JSONSchema Compliance

At this time, there are no plans to implement the following JSONSchema keywords:
* `title`
* `description`
* `default`
 * may be reconsidered in the future, but it is not our goal to modify input data

Additionally, *adhere* differentiates itself from the RFC in the following ways:
* all validation schemas **must** declare a single type or array of types
* allows top level validation of primitive and null values, not just arrays and objects
* the `format` keyword shall only be available for `string` schemas
* simplified `array` schema keywords `additionalItems` and `items`
  * the RFC describes a needlessly complex relationship between these two properties that provides little to no benefit
  * read above documentation of keywords for usage

*adhere* augments JSONSchema with the following keywords:
* `conform`
  * useful for situations when your validation outcome is dependent on a sibling property and/or programmatic validation is necessary
  * the `dependencies` keyword offers a schema dependency option, but this type of heavy lifting is not always necessary
* `messages`
  * custom messages for object properties that fail validation for one reason or another

## Gulp Tasks

```bash
gulp # lint and node tests
gulp lint # lint
gulp test # node tests
gulp coverage # node tests with coverage
```

### Local Browser Tests
The `test-browser` task will auto-detect browser executables via the following environment variables: `CHROME_BIN`, `SAFARI_BIN`, `FIREFOX_BIN`, `OPERA_BIN`, and `IE_BIN`. When using browser auto-detect, PhantomJS is always tested.

To test only specific browsers, use the `browsers` option.

```bash
gulp test-browser --browsers PhantomJS,Firefox
```

Possible browser flags include `Chrome`, `Safari`, `Firefox`, `Opera`, and `IE`.

[travis-image]: https://img.shields.io/travis/davidgwking/adhere.svg?style=flat&branch=master
[travis-url]: https://travis-ci.org/davidgwking/adhere
[coveralls-image]: https://img.shields.io/coveralls/davidgwking/adhere.svg?style=flat&branch=master
[coveralls-url]: https://coveralls.io/r/davidgwking/adhere
[saucelabs-url]: https://saucelabs.com/u/adhere
[saucelabs-image]: https://saucelabs.com/browser-matrix/adhere.svg
