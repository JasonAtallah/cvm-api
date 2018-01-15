const expect = require('chai').expect;
const Requests = require('./Requests');

const collection = require('../CannabisVendorMgmt.postman_collection.json');
const env = require('../env');
const requests = new Requests(collection, env);

module.exports = {
  env,
  expect,
  requests
}