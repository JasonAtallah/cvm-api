const traverse = require('traverse');
const request = require('request-promise-native');
const utils = require('./utils');

module.exports = class Request
{
  constructor(config)
  {
    this.config = config;
  }

  getMethod(env)
  {
    return this.config.method;
  }

  getUri(env)
  {
    return utils.replaceVars(this.config.url.raw, env);
  }

  getHeaders(env)
  {
    return this.config.header.reduce((memo, val) => {
      memo[val.key] = utils.replaceVars(val.value, env);
      return memo;
    }, {});
  }

  getData(env)
  {
    if (this.config.method === 'GET') {
      return null;
    }

    let data;

    if (this.config.body.raw) {
      try {
        data = JSON.parse(this.config.body.raw);
        utils.traverseVars(data, env);
      } catch (err) {
        console.log(err);
        data = {};
      }  
    }
    
    return data;
  }

  getOptions(env)
  {
    return {
      method: this.getMethod(env),
      uri: this.getUri(env),
      headers: this.getHeaders(env),
      body: this.getData(env),
      json: true,
      resolveWithFullResponse: true
    };
  }

  execute(env) {
    const options = this.getOptions(env);
    return request(options)
      .then((response) => {
        let body = response.body;

        if (response.headers['content-type'] === 'application/json') {
          body = JSON.parse(data);
        }

        return {
          statusCode: response.statusCode,
          body
        };
      })
      .catch((err) => {
        if (!err.statusCode) {
          throw err;
        }
        
        return {
          statusCode: err.statusCode,
          body: err.error
        };
      });
  }
};
