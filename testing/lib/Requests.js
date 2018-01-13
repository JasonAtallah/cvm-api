const traverse = require('traverse');
const Request = require('./Request');

module.exports = class Requests
{
  constructor(collection, env)
  {
    this.env = env;
    this.requests = traverse(collection).reduce((memo, node) => {
      if (node && node.hasOwnProperty('request')) {
        const requestName = `${node.request.method.toLowerCase()}-${node.name}`;
        memo[requestName] = new Request(node.request);
      }
      return memo;
    }, {});
  }

  run(reqName, params)
  {
    return this.requests[reqName].execute(Object.assign({}, this.env, params));
  }
};
