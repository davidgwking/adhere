var expect = require('chai').expect;
var adhere = require('../lib/adhere');

describe('$ref', function () {

  it('should interpolate referenced schemas', function () {
    var schema = {
      type: 'object',
      properties: {
        a: {$ref: '#mySchema'}, // simple reference
        b: {$ref: '#mySchema', definitions: {mySchema: {type: 'number'}}}, // child reference w/ overwrite
        c: {$ref: '#myRecursiveObjSchema'}, // recursive referencing
        d: {type: 'object', properties: {a: {$ref: '#mySchema'}}}, // deep child reference
      },
      definitions: {
        mySchema: {type: 'object'},
        myRecursiveObjSchema: {
          type: 'object',
          patternProperties: {
            a: {type: 'number', required: true},
            '.*': {$ref: '#myRecursiveObjSchema'}
          }
        }
      }
    };
    var val = {a: {}, b: 2, c: {a: 0, q: {a: 0, d: {a: 0}}}, d: {a: {}}};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  it('should interpolate self-referencing schemas', function () {
    var schema = {
      $ref: '#self',
      definitions: {self: {type: 'object'}}
    };
    var val = {};

    var result = adhere.validate(val, schema);
    expect(result.valid).to.eql(true);
  });

  describe('should interpolate some practical referenced schemas', function () {

    it('like a nested array with terminal case positive integer', function () {
      var schema = {
        type: 'array',
        items: { '$ref': '#recursiveArrayOfPositiveIntegers' },
        definitions: {
          recursiveArrayOfPositiveIntegers: {
            type: ['array', 'number'],
            items: { '$ref': '#recursiveArrayOfPositiveIntegers' },
            minimum: 0,
            exclusiveMinimum: true
          }
        }
      };
      var val = [1, 2, [[[[[5], 4]]]], [2]];

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('like an array of nested arrays with terminal case positive integer', function () {
      var schema = {
        type: 'array',
        items: { '$ref': '#recursiveArrayOfPositiveIntegers' },
        definitions: {
          recursiveArrayOfPositiveIntegers: {
            type: 'array',
            items: { '$ref': '#recursiveArrayOfPositiveIntegers' },
            // local definitions always take precedence
            definitions: {
              recursiveArrayOfPositiveIntegers: {
                type: ['array', 'number'],
                minimum: 0,
                exclusiveMinimum: true,
                items: { '$ref': '#recursiveArrayOfPositiveIntegers' },
              }
            }
          }
        }
      };
      var val = [[[[[[5], 4]]]], [2]];

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

  });

  describe('should be able to be used anywhere a subschema would typically be used', function () {

    it('like the array items keyword when items is a single schema', function () {
      var schema = {
        type: 'array',
        items: {$ref: '#mySchema'},
        definitions: {mySchema: {type: 'number'}}
      };

      var values = [[1, 2, 3], []];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('like the array items keyword when items is an array of schemas', function () {
      var schema = {
        type: 'array',
        items: [{type: 'number'}, {$ref: '#mySchema'}, {type: 'null'}],
        definitions: {mySchema: {type: 'string'}}
      };

      var values = [[1, 'a', null]];
      values.forEach(function (val) {
        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });
    });

    it('like the object properties keyword', function () {
      var visited = false, secondVisited = false;
      var schema = {
        type: 'object',
        properties: {
          a: {$ref: '#mySchema'},
          b: {
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

    it('like the object patternProperties keyword', function () {
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

    it('like the object dependencies keyword', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        },
        dependencies: {
          a: {$ref: '#mySchema'}
        },
        definitions: {
          mySchema: {
            type: 'object',
            properties: {
              a: {type: 'number', enum: [1]}
            }
          }
        }
      };
      var val = {a: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('like the universal allOf keyword', function () {
      var schema = {
        type: 'object',
        allOf: [{$ref: '#mySchema'}, {$ref: '#mySchema', definitions: {mySchema: {type: 'object'}}}],
        definitions: {mySchema: {type: 'object'}}
      };
      var val = {};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should the universal not keyword', function () {
      var schema = {
        type: 'number',
        not: {$ref: '#mySchema'},
        definitions: {mySchema: {type: 'object'}}
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('like the universal oneOf keyword', function () {
      var schema = {
        type: 'number',
        oneOf: [{$ref: '#mySchema2'}, {$ref: '#mySchema'}],
        definitions: {mySchema: {type: 'number'}, mySchema2: {type: 'object'}}
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('like the universal anyOf keyword', function () {
      var schema = {
        type: 'number',
        anyOf: [{$ref: '#mySchema', definitions: {mySchema: {type: 'number'}}}, {type: 'object'}],
        definitions: {mySchema: {type: 'object'}}
      };
      var val = 1;

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

  });

});
