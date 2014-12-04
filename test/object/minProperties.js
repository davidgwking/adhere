var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('minProperties', function () {

  it('should validate objects with a number of enumerable properties that is greater than or equal to the keyword value', function () {
    var schema = {
      type: 'object',
      minProperties: 1
    };
    var values = [{a: 1}, {a: 'b'}];

    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalidate objects with a number of enumerable properties that is less than keyword value', function () {
    var schema = {
      type: 'object',
      minProperties: 1
    };
    var val = {};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

});
