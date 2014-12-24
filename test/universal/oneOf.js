var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('oneOf', function () {

  it('should validate values with that satisfy only one keyword schema', function () {
    var schema = {
      type: 'number',
      oneOf: [{type: 'object'}, {type: 'number'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('should invalidate values with that satisfy multiple keyword schemas', function () {
    var schema = {
      type: 'number',
      oneOf: [{type: 'number'}, {type: 'number'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

  it('should invalidate values that do not satisfy any keyword schemas', function () {
    var schema = {
      type: 'number',
      oneOf: [{type: 'object'}, {type: 'object'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

});
