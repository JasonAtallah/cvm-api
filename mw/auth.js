const moment = require('moment');
const request = require('request-promise-native');
const jwksRsa = require('jwks-rsa');
const config = require('../config');
const jwt = require('../services/jwt');

module.exports = new class AuthMiddleware {

  authenticateGoogle (req, res, next) {
    const url = config.google.client.generateAuthUrl({
      access_type: 'offline',
      scope: config.google.scopes,
      state: req.loginCallback._id.toString()
    });
    res.redirect(url);
  }

  convertGoogleCode (req, res, next) {
    config.google.client.getToken(req.query.code, function (err, auth) {
      if (err) {
        next(err);
      } else {
        req.gAuth = auth;
        next();
      }
    });
  }

  generateClientJWT (req, res, next) {
    req.clientJWT = jwt.generate({
      sub: req.buyer._id
    });
    next();
  }

  getGoogleProfile (req, res, next) {
    var options = {
      method: 'GET',
      url: `https://people.googleapis.com/v1/people/me`,
      json: true,
      headers: {
        authorization: `Bearer ${req.gAuth.access_token}`
      },
      qs: {
        personFields: 'names,emailAddresses'
      }
    };

    request(options)
      .then((profile) => {
        req.gProfile = {
          id: profile.resourceName.split('/').pop(),
          firstName: profile.names[0].givenName,
          lastName: profile.names[0].familyName,
          email: profile.emailAddresses[0].value
        };
        next();
      });
  }

  isLoggedIn (req, res, next) {
    const authHeader = req.get('Authorization');
    const authToken = authHeader.replace('Bearer ', '');

    jwt.parse(authToken)
      .then((payload) => {
        req.userId = payload.sub;
        next();
      })
      .catch((err) => {
        res.status(401).send('Unauthorized');
      });
  }

  redirectToClient (req, res, next) {
    res.redirect(`${req.loginCallback}?code=${req.clientCode}`);
  }

};
