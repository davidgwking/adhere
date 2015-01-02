var expect = require('chai').expect;
var adhere = require('../lib/adhere');
var validators = require('../lib/validators');

describe('adhere', function () {

  it('should have a set of built-in validators', function () {
    expect(validators).to.be.instanceOf(Object);

    var validatorNames = Object.keys(validators);
    expect(validatorNames).to.eql(['object', 'number', 'integer', 'null', 'boolean', 'string', 'array']);

    validatorNames.forEach(function (vName) {
      expect(validators[vName]).to.be.instanceOf(Function);
    });
  });

  it('should export a function for validating values against schemas', function () {
    expect(adhere.validate).to.be.instanceOf(Function);
  });

  it('should export a function for injecting string formats', function () {
    expect(adhere.injectFormat).to.be.instanceOf(Function);
  });

  it('should validate a simple schema', function () {
    var schema = {
      type: 'object',
      properties: {
        a: {type: 'number'}
      }
    };
    var val = {a: 1};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  describe('should allow users to inject string formats', function () {

    it('and return true if added successfully', function () {
      [/.*/, {test: function () {return true;}}].forEach(function (pattern) {
        expect(adhere.injectFormat('myFormat', pattern)).to.eql(true);
      });
    });

    describe('and return false', function () {

      it('if the format\'s name is not a string', function () {
        [undefined, null, 0, function(){}, {}, true].forEach(function (name) {
          expect(adhere.injectFormat(name, /.*/)).to.eql(false);
        });
      });

      it('if the format\'s name is an empty string', function () {
        expect(adhere.injectFormat('', /.*/)).to.eql(false);
      });

      it('if the pattern is falsey', function () {
        [undefined, null, 0, '', false].forEach(function (pattern) {
          expect(adhere.injectFormat('myFormat', pattern)).to.eql(false);
        });
      });

      if ('if the pattern does not have a `test` method', function () {
        [{}, null, undefined, 0, 'test', true].forEach(function (pattern) {
          expect(adhere.injectFormat('myFormat', pattern)).to.eql(false);
        });
      });

    });

  });

});
