var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('uniqueItems', function () {

  it('should validate arrays with unique elements', function () {
    var schema = {
      type: 'array',
      uniqueItems: true
    };

    var values = [[], [1, 2, 3, 4]];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalid arrays that do not have unique elements', function () {
    var schema = {
      type: 'array',
      uniqueItems: true
    };

    var values = [[1, 1], [1, 2, 2]];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

});
