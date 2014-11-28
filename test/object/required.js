var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('required', function () {

  describe('properties', function () {

    it('valid if empty', function () {
      var schema = {
        type: 'object'
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('valid', function () {
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

    describe('invalid', function () {

      it('single', function () {
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

      it('multiple', function () {
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

  });

  describe('patternProperties', function () {

    it('valid if empty', function () {
      var schema = {
        type: 'object'
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('valid', function () {
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

    describe('invalid', function () {

      it('single', function () {
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

      it('multiple', function () {
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

  });

  describe('properties and patternProperties', function () {

    it('valid if empty', function () {
      var schema = {
        type: 'object'
      };
      var val = {a: 1, b: {}};

      var result = adhere.validate(val, schema);
      expect(result.valid).to.eql(true);
    });

    it('valid', function () {
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

    it('invalid property', function () {
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

    it('invalid patternProperty', function () {
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

    it('invalid property and patternProperty', function () {
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
