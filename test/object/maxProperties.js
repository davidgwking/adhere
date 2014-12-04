var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('maxProperties', function () {

  it('should validate objects with a number of enumerable properties that is less than or equal to the keyword value', function () {
    var schema = {
      type: 'object',
      maxProperties: 2
    };
    var values = [{a: 1}, {a: 1, b: 1}];

    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalidate objects with a number of enumerable properties that is greater than keyword value', function () {
    var schema = {
      type: 'object',
      maxProperties: 2
    };
    var val = {a: 1, b: 2, c: 3};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

});
