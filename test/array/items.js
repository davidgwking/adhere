var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('items', function () {

  describe('schema', function () {

    it('valid', function () {
      var schema = {
        type: 'array',
        items: {type: 'number'}
      };

      var values = [[1, 2, 3]];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('invalid', function () {
      var schema = {
        type: 'array',
        items: {type: 'number'}
      };

      var values = [[1, 'a', 3]];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('array of schemas', function () {

    it('valid', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {type: 'string'}, {type: 'null'}]
      };

      var values = [[1, 'a', null]];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('invalid', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {type: 'string'}, {type: 'null'}]
      };

      var values = [[1, 'a', 3], []];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

});
