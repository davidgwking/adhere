var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('anyOf', function () {

  it('should validate values that match any keyword schemas', function () {
    var schema = {
      type: 'number',
      anyOf: [{type: 'number'}, {type: 'object'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('should validate values that match all keyword schemas', function () {
    var schema = {
      type: 'number',
      anyOf: [{type: 'number'}, {type: 'number'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('should invalidate values that do not match any keyword schemas', function () {
    var schema = {
      type: 'number',
      anyOf: [{type: 'object'}, {type: 'object'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

  it('should resolve referenced schemas', function () {
    var schema = {
      type: 'number',
      anyOf: [{$ref: '#mySchema', definitions: {mySchema: {type: 'number'}}}, {type: 'object'}],
      definitions: {mySchema: {type: 'object'}}
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

});
