const expect = require('chai').expect;
const requireDirectory = require('require-directory');
const Requests = require('./Requests');

const collection = requireDirectory(module, '../../docs/requests');
const env = require('../env');
const data = require('../data');
const requests = new Requests(collection, env);

module.exports = {
  data,
  env,
  expect,
  requests
}
