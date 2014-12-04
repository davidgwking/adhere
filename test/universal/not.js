var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('not', function () {

  it('should validate values that do not satisfy the keyword schema', function () {
    var schema = {
      type: 'number',
      not: {
        type: 'object'
      }
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('should invalidate values that satisfy the keyword schema', function () {
    var schema = {
      type: 'number',
      not: {
        type: 'number'
      }
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

});
