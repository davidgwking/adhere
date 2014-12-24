var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('properties', function () {

  describe('should visit and validate an object', function () {

    it('when only one property is defined', function () {
      var visited = false;
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            conform: function () {
              visited = true;
              return true;
            }
          }
        }
      };
      var val = {a: 1};

      adhere.validate(val, schema);
      expect(visited).to.eql(true);
    });

    it('when multiple properties are defined', function () {
      var visited = false, secondVisited = false;
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            conform: function () {
              visited = true;
              return true;
            }
          },
          b: {
            type: 'number',
            conform: function () {
              secondVisited = true;
              return true;
            }
          }
        }
      };
      var val = {a: 1, b: 2};

      adhere.validate(val, schema);
      expect(visited).to.eql(true);
      expect(secondVisited).to.eql(true);
    });

  });

});
