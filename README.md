**THIS REPOSITORY IS A WORK IN PROGRESS**

# adhere
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]


This project is inspired by the [revalidator](https://github.com/flatiron/revalidator) project, so I must extend a shout out to those guys!

*adhere* is a schema\-based data validator for node that strives to empower developers with a robust, reliable, and, most importantly, simple data validation dependency. *adhere's* schema validation structure is heavily influenced by  [JSONSchema](http://json-schema.org/latest/json-schema-validation.html)

Unlike the JSONSchema specification, however, *adhere* is highly opinionated with respect to type\-defined keyword enforcement. *adhere* will allow direct validation against primitive (string, number, integer, boolean), reference (array and object), and null data types against declared schemas. In addition to data validation, *adhere* provide a means for validating schemas.

A simple type-agnostic validation engine provides [common validation keywords](http://json-schema.org/latest/json-schema-validation.html#anchor75). This project ships with numerous built\-in type validators that are executed by this engine.

Available types include the following: `object`, `array`, `string`, `number`, `integer`, `boolean`, and `null`.

## Usage

## Schema Composition

### Universal Keywords

#### type

#### enum

#### not

#### conform

#### anyOf

#### allOf

#### oneOf

### Object Keywords

#### properties

#### patternProperties

#### required

#### additionalProperties

#### dependencies

#### maxProperties

#### minProperties

### Array Keywords

#### items

#### additionalItems

#### maxItems

#### minItems

#### uniqueItems

### String Keywords

#### pattern

#### maxLength

#### minLength

### Number and Integer Keywords

#### maximum

#### minimum

#### mulitipleOf

### Boolean and Null Keywords

## JSONSchema Compliance

At this time, there are no plans to implement the following esoteric JSONSchema keywords:
* `title`
* `definitions`
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
* messages
  * custom messages for object properties that fail validation for one reason or another

[travis-image]: https://img.shields.io/travis/davidgwking/adhere.svg?style=flat
[travis-url]: https://travis-ci.org/davidgwking/adhere
[coveralls-image]: https://img.shields.io/coveralls/davidgwking/adhere.svg?style=flat
[coveralls-url]: https://coveralls.io/r/davidgwking/adhere?branch=master
