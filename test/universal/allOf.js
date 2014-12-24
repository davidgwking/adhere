var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('allOf', function () {

  it('should validate values that do not satisfy all keyword schemas', function () {
    var schema = {
      type: 'number',
      allOf: [{type: 'number'}, {type: 'number'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('should invalidate values that do not satisfy all keyword schemas', function () {
    var schema = {
      type: 'number',
      allOf: [{type: 'number'}, {type: 'object'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

  it('should invalidate values that do not satisfy any keyword schemas', function () {
    var schema = {
      type: 'number',
      allOf: [{type: 'object'}, {type: 'object'}, {type: 'number'}]
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(false);
  });

  it('should resolve referenced schemas', function () {
    var schema = {
      type: 'object',
      allOf: [{$ref: '#mySchema'}, {$ref: '#mySchema', definitions: {mySchema: {type: 'object'}}}],
      definitions: {mySchema: {type: 'object'}}
    };
    var val = {};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

});
