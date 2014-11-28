var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('not', function () {

  it('valid', function () {
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

  it('invalid', function () {
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
