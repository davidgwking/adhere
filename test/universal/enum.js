var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('enum', function () {

  describe('when object', function () {

    it('should be valid on match', function () {
      var schema = {
        type: 'object',
        enum: [{a: 2}, {a :1}, {}]
      };
      var val = {a: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should be invalid on no match', function () {
      var schema = {
        type: 'object',
        enum: [{a: 2}, {}]
      };
      var val = {a: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('number', function () {

    it('should be valid on match', function () {
      var schema = {
        type: 'number',
        enum: [0, 2, -1.23, 1.23]
      };
      var val = 2;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should be invalid on no match', function () {
      var schema = {
        type: 'number',
        enum: [0, -1.23, 1.23]
      };
      var val = 2;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('string', function () {

    it('should be valid on match', function () {
      var schema = {
        type: 'string',
        enum: ['a', 'b']
      };
      var val = 'a';

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should be invalid on no match', function () {
      var schema = {
        type: 'string',
        enum: ['a', 'b']
      };
      var val = 'c';

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('integer', function () {

    it('should be valid on match', function () {
      var schema = {
        type: 'integer',
        enum: [0, 2]
      };
      var val = 2;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should be invalid on no match', function () {
      var schema = {
        type: 'integer',
        enum: [0, 2]
      };
      var val = 3;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('array', function () {

    it('should be valid on match', function () {
      var schema = {
        type: 'array',
        enum: [[1, 2, 3], [4, 5, 6]]
      };
      var val = [4, 5, 6];

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should be invalid on no match', function () {
      var schema = {
        type: 'array',
        enum: [[1, 2, 3], [4, 5, 6]]
      };
      var val = [7, 8, 9];

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('boolean', function () {

    it('should be valid on match', function () {
      var schema = {
        type: 'boolean',
        enum: [true, false]
      };
      var val = true;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should be invalid on no match', function () {
      var schema = {
        type: 'boolean',
        enum: [true, true]
      };
      var val = false;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('null', function () {

    it('should be valid on match', function () {
      var schema = {
        type: 'null',
        enum: [null]
      };
      var val = null;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should be invalid on no match', function () {
      var schema = {
        type: 'null',
        enum: []
      };
      var val = null;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });
});
