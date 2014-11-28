var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('anyOf', function () {

  describe('one schema', function () {

    it('valid', function () {
      var schema = {
        type: 'number',
        anyOf: [{type: 'number'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid, no match', function () {
      var schema = {
        type: 'number',
        anyOf: [{type: 'object'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('multiple schemas', function () {

    it('valid', function () {
      var schema = {
        type: 'number',
        anyOf: [{type: 'number'}, {type: 'object'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid', function () {
      var schema = {
        type: 'number',
        anyOf: [{type: 'object'}, {type: 'object'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

});
