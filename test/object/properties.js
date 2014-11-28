var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('properties', function () {

  describe('should visit and validate', function () {

    it('one', function () {
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

    it('multiple', function () {
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
