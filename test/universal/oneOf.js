var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('oneOf', function () {

  describe('one schema', function () {

    it('valid', function () {
      var schema = {
        type: 'number',
        oneOf: [{type: 'number'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid, no match', function () {
      var schema = {
        type: 'number',
        oneOf: [{type: 'object'}]
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
        oneOf: [{type: 'object'}, {type: 'number'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid, multiple matches', function () {
      var schema = {
        type: 'number',
        oneOf: [{type: 'number'}, {type: 'number'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('invalid, no matches', function () {
      var schema = {
        type: 'number',
        oneOf: [{type: 'object'}, {type: 'object'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

});
