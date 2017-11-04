const request = require('request-promise');
const config = require('./config');

module.exports = {
  getMgr: (req, res, next) =>
  {
    var options = {
      method: 'POST',
      url: 'https://cannabis-vendor-mgmt.auth0.com/oauth/token',
      headers:
      {
        'content-type': 'application/json'
      },
      body: JSON.stringify(
      {
        client_id: config.auth0.client.id,
        client_secret: config.auth0.client.secret,
        audience: config.auth0.client.audience,
        grant_type: "client_credentials"
      })
    };

    request(options)
      .then((result) =>
      {
        req.mgr = JSON.parse(result);
        next();
      });
  },

  getUser: (req, res, next) =>
  {
    var options = {
      method: 'GET',
      url: `https://cannabis-vendor-mgmt.auth0.com/api/v2/users/${req.user.sub}`,
      headers:
      {
        authorization: `Bearer ${req.mgr.access_token}`
      }
    };

    request(options)
      .then((result) =>
      {
        req.user = JSON.parse(result);
        next();
      });
  }
};
