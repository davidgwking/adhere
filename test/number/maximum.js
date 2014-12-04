var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('maximum', function () {

  it('should validate numbers that are less than or equal to the keyword value', function () {
    var schema = {
      type: 'number',
      maximum: 10
    };

    var values = [ -Infinity, 0, 10, 9.999999];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalidate numbers that are greater than the keyword value', function () {
    var schema = {
      type: 'number',
      maximum: 10
    };

    var values = [10.000001, Infinity];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

  describe('exclusiveMaximum', function () {

    it('if true, should validate numbers that are less than the `maximum` keyword value', function () {
      var schema = {
        type: 'number',
        maximum: 10,
        exclusiveMaximum: true
      };

      var values = [-Infinity, 0, 9.9999999];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('if true, should invalidate numbers that are greater than or equal to the `maximum` keyword value', function () {
      var schema = {
        type: 'number',
        maximum: 10,
        exclusiveMaximum: true
      };

      var values = [Infinity, 10];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

});
