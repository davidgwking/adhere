var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('items', function () {

  describe('as a single schema', function () {

    it('should validate arrays with elements that all satisfy the items schema', function () {
      var schema = {
        type: 'array',
        items: {type: 'number'}
      };

      var values = [[1, 2, 3], []];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate arrays with one or many elements that do not satisfy the items schema', function () {
      var schema = {
        type: 'array',
        items: {type: 'number'}
      };

      var values = [[1, 'a', 3], ['a', 'a']];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('as an array of schemas', function () {

    it('should validate arrays with elements satisfying all coresponding items schemas', function () {
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

    it('should invalidate arrays with one or more elements that do not satisfy corresonding items schemas', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {type: 'string'}, {type: 'null'}]
      };

      var values = [[1, 'a', 3], [], ['a', 1, '2']];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

});
