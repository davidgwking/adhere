var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('dependencies', function () {

  describe('property dependencies', function () {

    it('valid', function () {
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

    it('invalid when dependencies is invalid', function () {
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

    it('invalid when cannot validate property as not in schema', function () {
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

    it('should be able to have a property with a dependency despite no property declaration', function () {
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

  describe('schema dependencies', function () {

    it('valid', function () {
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

    it('invalid', function () {
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

    it('should enforce dependencies for properties that don\'t have explicit schema declaration', function () {
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
