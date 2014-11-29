var expect = require('chai').expect;
var adhere = require('../../lib/adhere');

describe('additionalProperties', function () {

  describe('allowed', function () {

    describe('valid', function () {

      it('properties', function () {
        var schema = {
          type: 'object',
          properties: {
            a: {type: 'number'}
          }
        };
        var val = {a: 1, b: 2};

        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });

      it('patternProperties', function () {
        var schema = {
          type: 'object',
          patternProperties: {
            '^a$': {type: 'number'}
          }
        };
        var val = {a: 1, b: 2};

        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });

      it('properties and patternProperties', function () {
        var schema = {
          type: 'object',
          properties: {
            a: {type: 'number'}
          },
          patternProperties: {
            '^b$': {type: 'number'}
          }
        };
        var val = {a: 1, b: 2, c: 3};

        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(true);
      });

    });

  });

  describe('disallowed', function () {

    describe('valid', function () {

      it('properties', function () {
        var schema = {
          type: 'object',
          additionalProperties: false,
          properties: {
            a: {type: 'number'}
          }
        };
        var val = {a: 1, b: 2, c: 3};

        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });

      it('patternProperties', function () {
        var schema = {
          type: 'object',
          additionalProperties: false,
          patternProperties: {
            '^a$': {type: 'number'}
          }
        };
        var val = {a: 1, b: 2, c: 4};

        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });

      it('properties and patternProperties', function () {
        var schema = {
          type: 'object',
          additionalProperties: false,
          properties: {
            a: {type: 'number'}
          },
          patternProperties: {
            '^b$': {type: 'number'}
          }
        };
        var val = {a: 1, b: 2, c: 3, d: true};

        var result = adhere.validate(val, schema);
        expect(result.valid).to.eql(false);
      });

    });

  });

});
