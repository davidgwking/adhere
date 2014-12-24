var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('patternProperties', function () {

  it('should visit and validate an object', function () {

    it('when only one pattern is defined', function () {
      var visited = false;
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {
            type: 'number',
            conform: function () {
              visited = true;
              return true;
            }
          }
        }
      };
      var val = {a: 1, b: 2};

      adhere.validate(val, schema);
      expect(visited).to.eql(true);
    });

    it('when multiple patterns are defined', function () {
      var visited = false, secondVisited = false;
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {
            type: 'number',
            conform: function () {
              visited = true;
              return true;
            }
          },
          '^b$': {
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

    it('resolving referenced schemas', function () {
      var visited = false, secondVisited = false;
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {$ref: '#mySchema'},
          '^b$': {
            type: 'number',
            conform: function () {
              secondVisited = true;
              return true;
            }
          }
        },
        definitions: {
          mySchema: {
            type: 'number',
            conform: function () {
              visited = true;
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
