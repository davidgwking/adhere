var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('dependencies', function () {

  describe('as property dependencies', function () {

    it('should validate an object that has dependencies and all dependencies are valid', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'},
          b: {type: 'number', enum: [1]}
        },
        dependencies: {
          a: ['b']
        }
      };
      var val = {a: 1, b: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should invalidate an object that has dependencies and at least one dependecy is invalid', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'},
          b: {type: 'number', enum: [2]}
        },
        dependencies: {
          a: ['b']
        }
      };
      var val = {a: 1, b: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should invalidate an object that has a dependency, but that dependency fails because the property was not visited', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'},
        },
        dependencies: {
          a: ['b']
        }
      };
      var val = {a: 1, b: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should validate an object that has a property which has a dependency that is valid, but does not have a corresponding ' +
        '`properties` schema', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'},
        },
        dependencies: {
          c: ['a']
        }
      };
      var val = {a: 1, b: 1, c: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

  });

  describe('as schema dependencies', function () {

    it('should validate objects with properties that have dependencies and the object itself satisfies the dependencies', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        },
        dependencies: {
          a: {
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

    it('should validate objects with properties that have dependencies but the object does not satisfy at last one of the dependencies', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        },
        dependencies: {
          a: {
            type: 'object',
            properties: {
              a: {type: 'number', enum: [2]}
            }
          }
        }
      };
      var val = {a: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should invalidate an object that has a property which has a dependency that is invalid even if the property with the ' +
        'dependency wasn\'t visited', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {type: 'number'}
        },
        dependencies: {
          b: {
            type: 'object',
            properties: {
              a: {type: 'number', enum: [2]}
            }
          }
        }
      };
      var val = {a: 1, b: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

});
