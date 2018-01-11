var Ajv = require('ajv');

var schema = require('../schemas/new-vendor.json');
var data = require('../data/new-vendor.json');

var ajv = new Ajv();
var validate = ajv.compile(schema);
var valid = validate(data);

console.log(`valid? ${valid}`);
if (!valid) console.log(validate.errors);
