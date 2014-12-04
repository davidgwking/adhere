var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('additionalItems', function () {

  it('by default, should validate arrays that have as many or more elements than items schemas', function () {
    var schema = {
      type: 'array',
      items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
    };

    var values = [[1, 'a', null], [1, 'a', null, 'test']];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  describe('if enabled', function () {
    it('should validate arrays that have as many or more elements than items schemas', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
        additionalItems: true
      };

      var values = [[1, 'a', null], [1, 'a', null, 'test']];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate arrays that have less elements than items schemas', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
        additionalItems: true
      };

      var val = [1, 'a'];
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

  describe('if disabled', function () {
    it('should invalidate arrays that have more elements than items schemas', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
        additionalItems: false
      };

      var val = [1, 'a', null, 'test'];
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should validate arrays that have as many elements as items schemas', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
        additionalItems: false
      };

      var val = [1, 'a', null];
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

});
