var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('pattern', function () {

  describe('string', function () {

    it('valid', function () {
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

    it('invalid', function () {
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

  describe('regexp', function () {

    it('valid', function () {
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

    it('invalid', function () {
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
