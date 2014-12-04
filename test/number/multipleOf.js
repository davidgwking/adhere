var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('multipleOf', function () {

  it('should validate numbers that are multiples of the keyword value', function () {
    var schema = {
      type: 'number',
      multipleOf: 10
    };

    var values = [10, -10, 80, -80];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalidate numbers that are not multiple of the keyword value', function () {
    var schema = {
      type: 'number',
      multipleOf: 7
    };

    var values = [10, -10, 80, -80];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

  it('should always invalidate numbers if the keyword value is Infinity', function () {
    var schema = {
      type: 'number',
      multipleOf: Infinity
    };

    var values = [10, -10, 80, -80];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

  it('should always invalidate numbers if the keyword value is zero', function () {
    var schema = {
      type: 'number',
      multipleOf: 0
    };

    var values = [10, -10, 80, -80];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

});
