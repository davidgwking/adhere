var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('minProperties', function () {

  it('valid', function () {
    var schema = {
      type: 'object',
      minProperties: 1
    };
    var val = {a: 1};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('invalid', function () {
    var schema = {
      type: 'object',
      minProperties: 1
    };
    var val = {};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

});
