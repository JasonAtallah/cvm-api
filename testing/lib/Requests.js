const traverse = require('traverse');
const Request = require('./Request');

module.exports = class Requests
{
  constructor(collection, env)
  {
    this.requests = traverse(collection).reduce((memo, node) => {
      if (node && node.hasOwnProperty('request')) {
        memo[node.name] = new Request(node.request, env);
      }
      return memo;
    }, {});
  }

  run(reqName, env)
  {
    return this.requests[reqName].execute(env);
  }
};
