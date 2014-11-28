var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('maxItems', function () {

  it('valid', function () {
    var schema = {
      type: 'array',
      maxItems: 1
    };

    var values = [[], [1]];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('invalid', function () {
    var schema = {
      type: 'array',
      maxItems: 1
    };

    var values = [[1, 2], [1, 2, 3]];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

});
