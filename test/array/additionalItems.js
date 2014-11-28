var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('additionalItems', function () {

  it('valid', function () {
    var schema = {
      type: 'array',
      items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
      additionalItems: true
    };

    var values = [[1, 'a', null, 'test']];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should default to true', function () {
    var schema = {
      type: 'array',
      items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
    };

    var values = [[1, 'a', null, 'test']];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('invalid', function () {
    var schema = {
      type: 'array',
      items: [{type: 'number'}, {type: 'string'}, {type: 'null'}],
      additionalItems: false
    };

    var values = [[1, 'a', 3, 'test']];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

});
