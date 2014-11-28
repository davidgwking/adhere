var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('conform', function () {

  it('should pass the value being tested', function () {
    var passedVal;
    var schema = {
      type: 'number',
      conform: function (val) { passedVal = val; return true; }
    };
    var val = 1;

    var result = adhere.validate(val, schema);
    expect(passedVal).to.eql(val);
    expect(result.valid).to.eql(true);
  });

  it('should pass the value being tested and a parent val', function () {
    var passedVal, passedParentVal;
    var schema = {
      type: 'object',
      properties: {
        a: {
          type: 'object',
          properties: {
            x: {
              type: 'number',
              conform: function (val, parent) {
                passedVal = val;
                passedParentVal = parent;
                return false;
              }
            }
          }
        }
      }
    };
    var val = {a: {x: 1}};

    var result = adhere.validate(val, schema);
    expect(passedVal).to.eql(val.a.x);
    expect(passedParentVal).to.eql(val.a);
    expect(result.valid).to.eql(false);
  });

});
