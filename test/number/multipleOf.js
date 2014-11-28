var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('multipleOf', function () {

  it('valid', function () {
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

  it('invalid', function () {
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

  it('invalid infinity', function () {
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

  it('invalid multiple by zero', function () {
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
