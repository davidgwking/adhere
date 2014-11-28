var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('enum', function () {

  describe('object', function () {

    it('valid', function () {
      var schema = {
        type: 'object',
        enum: [{a: 2}, {a :1}, {}]
      };
      var val = {a: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid', function () {
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

    it('valid', function () {
      var schema = {
        type: 'number',
        enum: [0, 2, -1.23, 1.23]
      };
      var val = 2;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid', function () {
      var schema = {
        type: 'number',
        enum: [0, -1.23, 1.23]
      };
      var val = 2;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('string', function () { });
  describe('integer', function () { });
  describe('array', function () { });
  describe('boolean', function () { });
  describe('null', function () { });
});
