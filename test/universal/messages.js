var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('messages', function () {
  
  it('should report custom error messages for failure properties', function () {
    var schema = {
      type: 'object',
      enum: [{a: 2}],
      messages: {
        enum: 'test message'
      }
    };
    var val = {a: 1};

    var result = adhere.validate(val, schema);

    expect(result.valid).to.eql(false);
    expect(result.errors[0].message).to.eql('test message');
  });

  it('should otherwise report a standard error', function () {
    var schema = {
      type: 'object',
      enum: [{a: 2}],
    };
    var val = {a: 1};

    var result = adhere.validate(val, schema);

    expect(result.valid).to.eql(false);
    expect(result.errors[0].message).to.eql('value is not in declared enumeration');
  });

});
