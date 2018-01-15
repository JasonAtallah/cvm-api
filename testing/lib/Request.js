const traverse = require('traverse');
const request = require('request-promise-native');
const utils = require('./utils');

module.exports = class Request
{
  constructor(config)
  {
    this.config = config;
  }

  getMethod(params)
  {
    return this.config.method;
  }

  getUri(params)
  {
    return utils.replaceVars(this.config.url.raw, params);
  }

  getHeaders(params)
  {
    return this.config.header.reduce((memo, val) => {
      memo[val.key] = utils.replaceVars(val.value, params);
      return memo;
    }, {});
  }

  getData(params)
  {
    if (this.config.method === 'GET') {
      return null;
    }

    let data;

    try {
      let raw = utils.replaceVars(this.config.body.raw, params);
      data = JSON.parse(raw);
    } catch (err) {
      data = {};
    }

    return data;
  }

  getOptions(params)
  {
    return {
      method: this.getMethod(params),
      uri: this.getUri(params),
      headers: this.getHeaders(params),
      body: this.getData(params),
      json: true,
      resolveWithFullResponse: true
    };
  }

  execute(params) {
    const options = this.getOptions(params);

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
      });
  }
};
