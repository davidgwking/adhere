var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('maxLength', function () {

  it('should validate strings with length less than or equal to the keyword value', function () {
    var schema = {
      type: 'string',
      maxLength: 5
    };

    var values = ['', '1', '12345'];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalidate strings with length greater than the keyword value', function () {
    var schema = {
      type: 'string',
      maxLength: 5
    };

    var values = ['123456'];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

});
