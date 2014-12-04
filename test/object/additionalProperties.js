var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('additionalProperties', function () {

  describe('by default, should validate', function () {

    it('objects with enumerable properties that don\'t have a dedicated schema in the `properties` keyword', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        }
      };
      var val = {a: 1, b: 2};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);

      val = {a: 1};
      result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('objects with enumerable properties that don\'t match a `patternProperties` keyword pattern', function () {
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {type: 'number'}
        }
      };
      var val = {a: 1, b: 2};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('objects with enumerable properties that don\'t have a dedicated schema in the `properties` keyword and ' +
        'don\'t match a `patternProperties` keyword pattern', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        },
        patternProperties: {
          '^b$': {type: 'number'}
        }
      };
      var val = {a: 1, b: 2, c: 3};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

  });

  describe('if enabled, should validate', function () {

    it('objects with enumerable properties that don\'t have a dedicated schema in the `properties` keyword', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        }
      };
      var val = {a: 1, b: 2};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);

      val = {a: 1};
      result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('objects with enumerable properties that don\'t match a `patternProperties` keyword pattern', function () {
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {type: 'number'}
        }
      };
      var val = {a: 1, b: 2};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('objects with enumerable properties that don\'t have a dedicated schema in the `properties` keyword and ' +
        'don\'t match a `patternProperties` keyword pattern', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        },
        patternProperties: {
          '^b$': {type: 'number'}
        }
      };
      var val = {a: 1, b: 2, c: 3};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

  });

  describe('if disabled, should invalidate', function () {

    it('objects with enumerable properties that don\'t have a dedicated schema in the `properties` keyword', function () {
      var schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
          a: {type: 'number'}
        }
      };
      var val = {a: 1, b: 2, c: 3};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('objects with enumerable properties that don\'t match a `patternProperties` keyword pattern', function () {
      var schema = {
        type: 'object',
        additionalProperties: false,
        patternProperties: {
          '^a$': {type: 'number'}
        }
      };
      var val = {a: 1, b: 2, c: 4};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('objects with enumerable properties that don\'t have a dedicated schema in the `properties` keyword and ' +
        'don\'t match a `patternProperties` keyword pattern', function () {
      var schema = {
        type: 'object',
        additionalProperties: false,
        properties: {
          a: {type: 'number'}
        },
        patternProperties: {
          '^b$': {type: 'number'}
        }
      };
      var val = {a: 1, b: 2, c: 3, d: true};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

});
