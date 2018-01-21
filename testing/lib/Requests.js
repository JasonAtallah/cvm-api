const traverse = require('traverse');
const _ = require('lodash');
const Request = require('./Request');

module.exports = class Requests
{
  constructor(collection, globalEnv)
  {
    this.globalEnv = globalEnv;
    this.requests = traverse(collection).reduce((memo, node) => {
      if (node && node.hasOwnProperty('request')) {
        const requestName = `${node.request.method.toLowerCase()}-${node.name}`;
        memo[requestName] = new Request(node.request);
      }
      return memo;
    }, {});
  }

  run(reqName, localEnv, envUpdates)
  {
    return this.requests[reqName].execute(Object.assign({}, this.globalEnv, localEnv))
      .then((response) => {
        if(envUpdates) {
            Object.keys(envUpdates).forEach((key) => {
              const envValue = _.get(response, envUpdates[key]);
              _.set(localEnv, key, envValue);
            });          
          }
          return response;
        });
  }

  runAll(reqList, localEnv)
  {
    let runP = Promise.resolve();

    reqList.forEach((req) => {
      let reqName, envUpdates;

      if (typeof req === 'string') {
        reqName = req;
      } else {
        reqName = req[0];
        envUpdates = req[1];
      }

      runP = runP.then(() => {
        return this.run(reqName, localEnv, envUpdates);
      });
    });

    return runP;
  }
};
