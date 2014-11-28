var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('maxProperties', function () {

  it('valid', function () {
    var schema = {
      type: 'object',
      maxProperties: 2
    };
    var val = {a: 1, b: 1};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('invalid', function () {
    var schema = {
      type: 'object',
      maxProperties: 2
    };
    var val = {a: 1, b: 2, c: 3};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

});
