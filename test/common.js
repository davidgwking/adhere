var expect = require('chai').expect;
var utils = require('../lib/common');

describe('common', function () {

  describe('resolveSubschema', function () {

    it('should resolve a referenced subschema', function () {
      var schema = {$ref: '#mySubschema'};
      var definitions = {mySubschema: {type: 'null'}};

      var resolved = utils.resolveSubschema(schema, definitions, '');
      expect(resolved).to.eql(definitions.mySubschema);
    });

    it('should resolve a root schema if no subschema is referenced', function () {
      var schema = {type: 'array'};
      var definitions = {mySubschema: {type: 'null'}};

      var resolved = utils.resolveSubschema(schema, definitions, '');
      expect(resolved).to.eql(schema);
    });

    it('should return an empty schema when a referenced subschema is not found in definitions', function () {
      var schema = {$ref: '#notExist'};
      var definitions = {mySubschema: {type: 'null'}};

      var resolved = utils.resolveSubschema(schema, definitions, '');
      expect(resolved).to.eql({});
    });

  });

});
