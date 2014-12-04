var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('required', function () {

  describe('if used on properties', function () {

    it('should validate an object when undefined', function () {
      var schema = {
        type: 'object'
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should validate an object when empty', function () {
      var schema = {
        type: 'object',
        properties: {}
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should validate an object when all schemas are satisfied', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            required: true
          },
          b: {
            type: 'object',
            required: true
          }
        }
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should invalidate an object when one schema is not satisfied', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            required: true
          },
          b: {
            type: 'object',
            required: true
          }
        }
      };
      var val = {a: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should invalidate an object when many schemas are not satisfied', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            required: true
          },
          b: {
            type: 'object',
            required: true
          }
        }
      };
      var val = {};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('patternProperties', function () {

    it('should validate an object when undefined', function () {
      var schema = {
        type: 'object'
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should validate an object when empty', function () {
      var schema = {
        type: 'object',
        patternProperties: {}
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should validate an object when all schemas are satisfied', function () {
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {
            type: 'number',
            required: false
          },
          '^b$': {
            type: 'object',
            required: true
          }
        }
      };
      var val = {b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should invalidate an object when one schema is not satisfied', function () {
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {
            type: 'number',
            required: true
          },
          '^b$': {
            type: 'object',
            required: true
          }
        }
      };
      var val = {a: 1};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should invalidate an object when many schemas are not satisfied', function () {
      var schema = {
        type: 'object',
        patternProperties: {
          '^a$': {
            type: 'number',
            required: true
          },
          '^b$': {
            type: 'object',
            required: true
          }
        }
      };
      var val = {};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

  describe('properties and patternProperties', function () {

    it('should validate an object when undefined', function () {
      var schema = {
        type: 'object'
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should validate an object when empty', function () {
      var schema = {
        type: 'object',
        properties: {},
        patternProperties: {}
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should validate an object when all schemas are satisfied', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            required: true
          },
        },
        patternProperties: {
          '^b$': {
            type: 'object',
            required: true
          }
        }
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('should invalidate an object when a `properties` schema is not satisfied', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            required: true
          },
          c: {
            type: 'object',
            required: true
          }
        },
        patternProperties: {
          '^b$': {
            type: 'object',
            required: true
          }
        }
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should invalidate an object when a `patternProperties` schema is not satisfied', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            required: true
          },
        },
        patternProperties: {
          '^b$': {
            type: 'object',
            required: true
          },
          '^c$': {
            type: 'object',
            required: true
          }
        }
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

    it('should invalidate an object when both are not satisfied', function () {
      var schema = {
        type: 'object',
        properties: {
          a: {
            type: 'number',
            required: true
          },
          c: {
            type: 'object',
            required: true
          }
        },
        patternProperties: {
          '^b$': {
            type: 'object',
            required: true
          },
          '^d$': {
            type: 'object',
            required: true
          }
        }
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(false);
    });

  });

});
