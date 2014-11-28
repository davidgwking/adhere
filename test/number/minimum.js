var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('minimum', function () {

  it('valid', function () {
    var schema = {
      type: 'number',
      minimum: 10
    };

    var values =  [10, 10.000001, Infinity];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });
  });

  it('invalid', function () {
    var schema = {
      type: 'number',
      minimum: 10
    };

    var values = [ -Infinity, 0, 9.999999];
    values.forEach(function (val) {
      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });
  });

  describe('exclusiveMinimum', function () {

    it('valid', function () {
      var schema = {
        type: 'number',
        minimum: 10,
        exclusiveMinimum: true
      };

      var values = [Infinity, 10.000001];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('invalid', function () {
      var schema = {
        type: 'number',
        minimum: 10,
        exclusiveMinimum: true
      };

      var values = [-Infinity, 9.9999, 10, 0];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

});
