const jwksRsa = require('jwks-rsa');
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const moment = require('moment');
const request = require('request-promise');
const config = require('../config');

module.exports = {
  getMgr: (req, res, next) => {

    if (config.mgmt.accessToken) {
      if (moment().isBefore(config.mgmt.accessDate)) {
        return next();
      }
    }

    var options = {
      method: 'POST',
      url: 'https://cannabis-vendor-mgmt.auth0.com/oauth/token',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(
        {
          client_id: config.auth0.client.id,
          client_secret: config.auth0.client.secret,
          audience: config.auth0.client.audience,
          grant_type: 'client_credentials'
        })
    };

    request(options)
      .then((result) => {
        const manager = JSON.parse(result);
        config.mgmt.accessToken = manager.access_token;
        config.mgmt.accessDate = moment().add(manager.expires_in, 'seconds');
        next();
      });
  },

  getGoogleProfile: (req, res, next) => {
    var options = {
      method: 'GET',
      url: `https://cannabis-vendor-mgmt.auth0.com/api/v2/users/${req.user.sub}`,
      headers: {
        authorization: `Bearer ${config.mgmt.accessToken}`
      }
    };

    request(options)
      .then((result) => {
        req.gProfile = JSON.parse(result);
        req.gAccessToken = req.gProfile.identities[0].access_token;
        next();
      });
  },

  getGoogleToken: (req, res, next) => {
    var options = {
      method: 'GET',
      url: `https://cannabis-vendor-mgmt.auth0.com/api/v2/users/${req.user.sub}`,
      headers: {
        authorization: `Bearer ${config.mgmt.accessToken}`
      }
    };

    request(options)
      .then((result) => {
        req.gAccessToken = JSON.parse(result).identities[0].access_token;
        next();
      });
  },

  isLoggedIn: (function () {
    const jwtMW = jwt({
      secret: jwksRsa.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: config.auth0.jwksUri
      }),
      audience: config.auth0.audience,
      issuer: config.auth0.issuer,
      algorithms: [config.auth0.algorithm]
    });

    return function (req, res, next) {
      jwtMW(req, res, function (err) {
        if (err) {
          next(err);
        } else {
          req.userId = req.user.sub || req.user.user_id;
          next();
        }
      });
    };
  })(),

  isUserId: (paramName) => {
    return (req, res, next) => {
      if (req.params[paramName] !== req.userId) {
        const err = new Error('Unauthorized.');
        err.status = 401;
        next(err);
      } else {
        next();
      }
    };
  }

};
