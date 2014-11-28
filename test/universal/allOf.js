var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('allOf', function () {

  describe('one schema', function () {

    it('valid', function () {
      var schema = {
        type: 'number',
        allOf: [{type: 'number'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid, no match', function () {
      var schema = {
        type: 'number',
        allOf: [{type: 'object'}]
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
        allOf: [{type: 'number'}, {type: 'number'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('invalid, one no match', function () {
      var schema = {
        type: 'number',
        allOf: [{type: 'number'}, {type: 'object'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('invalid, multiple no matches', function () {
      var schema = {
        type: 'number',
        allOf: [{type: 'object'}, {type: 'object'}, {type: 'number'}]
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

});
