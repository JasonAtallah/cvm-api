const traverse = require('traverse');
const Request = require('./Request');

module.exports = class Requests
{
  constructor(collection, env)
  {
    this.env = env;
    this.requests = traverse(collection).reduce((memo, node) => {
      if (node && node.hasOwnProperty('request')) {
        memo[node.name] = new Request(node.request);
      }
      return memo;
    }, {});
  }

  run(reqName, params)
  {
    return this.requests[reqName].execute(Object.assign({}, this.env, params));
  }
};
