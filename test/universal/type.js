var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

var testVals = [
  {}, {a: 1}, // valid objects
  -1.23, 1.23, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, // valid numbers,
  0, -1, 1, // valid integers
  'abcdef', '', // valid strings
  [], [0], // valid array
  true, false, // valid boolean
  null, // valid null
  undefined, NaN, new Date() // invalidatable (by default)
];

describe('type', function () {

  describe('of object', function () {

    it('should validate an object', function () {
      var schema = {type: 'object'};
      var vals = testVals.slice(0,2);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate a non-object', function () {
      var schema = {type: 'object'};
      var vals = testVals.slice(2);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('number', function () {

    it('should validate a number', function () {
      var schema = {type: 'number'};
      var vals = testVals.slice(2, 9);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate a non-number', function () {
      var schema = {type: 'number'};
      var vals = testVals.slice(0, 2).concat(testVals.slice(9));

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('integer', function () {

    it('should validate an integer', function () {
      var schema = {type: 'integer'};
      var vals = testVals.slice(6, 9);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate a non-integer', function () {
      var schema = {type: 'integer'};
      var vals = testVals.slice(0, 6).concat(testVals.slice(9));

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('null', function () {

    it('should validate a null', function () {
      var schema = {type: 'null'};
      var vals = testVals.slice(15, 16);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate a non-null', function () {
      var schema = {type: 'null'};
      var vals = testVals.slice(0, 15).concat(testVals.slice(16));

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('boolean', function () {

    it('should validate a boolean', function () {
      var schema = {type: 'boolean'};
      var vals = testVals.slice(13, 15);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate a non-boolean', function () {
      var schema = {type: 'boolean'};
      var vals = testVals.slice(0, 13).concat(testVals.slice(15));

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('string', function () {

    it('should validate a string', function () {
      var schema = {type: 'string'};
      var vals = testVals.slice(9, 11);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate a non-string', function () {
      var schema = {type: 'string'};
      var vals = testVals.slice(0, 9).concat(testVals.slice(11));

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('array', function () {

    it('should validate an array', function () {
      var schema = {type: 'array'};
      var vals = testVals.slice(11, 13);

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate a non-array', function () {
      var schema = {type: 'array'};
      var vals = testVals.slice(0, 11).concat(testVals.slice(13));

      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });


  describe('array of types', function () {

    it('should validate matches', function () {
      var schema = {type: ['object', 'number']};

      var vals = testVals.slice(0, 9);
      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate non-matches', function () {
      var schema = {type: ['object', 'number']};

      var vals = testVals.slice(9);
      vals.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });
});
