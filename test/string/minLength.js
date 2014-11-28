var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('minLength', function () {

  it('valid', function () {
    var schema = {
      type: 'string',
      minLength: 5
    };

    var values = ['12345'];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('invalid', function () {
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
