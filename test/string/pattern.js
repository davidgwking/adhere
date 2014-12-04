var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('pattern', function () {

  describe('as a string', function () {

    it('should validate strings that match the pattern', function () {
      var schema = {
        type: 'string',
        pattern: '^\\d+$'
      };

      var values = ['12345', '1'];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate strings that do not match the pattern', function () {
      var schema = {
        type: 'string',
        pattern: '^\\d+$'
      };

      var values = ['a', '', '$CASHMONEY'];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

  describe('as a RegExp', function () {

    it('should validate strings that match the pattern', function () {
      var schema = {
        type: 'string',
        pattern: /^\d+a$/i
      };

      var values = ['12345a', '1A'];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('should invalidate strings that do not match the pattern', function () {
      var schema = {
        type: 'string',
        pattern: /^\d+$/
      };

      var values = ['a', '', '$CASHMONEY'];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });
    });

  });

});
