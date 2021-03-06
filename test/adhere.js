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

});
