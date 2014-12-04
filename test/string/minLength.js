var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('minLength', function () {

  it('should validate strings with length greater than or equal to the keyword value', function () {
    var schema = {
      type: 'string',
      minLength: 5
    };

    var values = ['12345', '123456'];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('should invalidate strings with length less than the keyword value', function () {
    var schema = {
      type: 'string',
      minLength: 5
    };

    var values = ['', '1', '1234'];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

});
