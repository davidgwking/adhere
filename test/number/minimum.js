var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('minimum', function () {

  it('should validate numbers that are greater than or equal to the keyword value', function () {
    var schema = {
      type: 'number',
      minimum: 10
    };

    var values =  [10, 10.000001, Infinity];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalidate numbers that are less than the keyword value', function () {
    var schema = {
      type: 'number',
      minimum: 10
    };

    var values = [ -Infinity, 0, 9.999999];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

  describe('exclusiveMinimum', function () {

    it('if true, should validate numbers that are greater than the `minimum` keyword value', function () {
      var schema = {
        type: 'number',
        minimum: 10,
        exclusiveMinimum: true
      };

      var values = [Infinity, 10.000001];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('if true, should invalidate numbers that are less than or equal to the `minimum` keyword value', function () {
      var schema = {
        type: 'number',
        minimum: 10,
        exclusiveMinimum: true
      };

      var values = [-Infinity, 9.9999, 10, 0];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

});
