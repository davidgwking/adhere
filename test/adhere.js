var expect = require('chai').expect;
var adhere = require('../lib/adhere');

describe('adhere', function () {

  it('is expected to export builtin validators', function () {
    var validators = adhere.validators;
    expect(validators).to.be.instanceOf(Object);

    var validatorNames = Object.keys(validators);
    expect(validatorNames).to.eql(['object', 'number', 'integer', 'null', 'boolean', 'string', 'array']);

    validatorNames.forEach(function (vName) {
      expect(validators[vName]).to.be.instanceOf(Function);
    });
  });

  it('is expected to export a function for validating values against schemas', function () {
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
