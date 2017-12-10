const google = require('googleapis');
const moment = require('moment');
const jwksRsa = require('jwks-rsa');
const request = require('request-promise');
const config = require('../config');
const jwt = require('../services/jwt');

module.exports = new class AuthMiddleware {

  authenticateGoogle (callbackUrl) {
    return (req, res, next) => {
      const client = new google.auth.OAuth2(
        config.google.clientId,
        config.google.clientSecret,
        callbackUrl
      );
      const scopes = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/gmail.modify',
        'https://www.googleapis.com/auth/calendar'
      ];
      const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
        state: req.loginCallback._id.toString()
      });
      res.redirect(url);
    };
  }

  convertGoogleCode (callbackUrl) {
    return (req, res, next) => {
      const client = new google.auth.OAuth2(
        config.google.clientId,
        config.google.clientSecret,
        callbackUrl
      );

      client.getToken(req.query.code, function (err, auth) {
        if (err) {
          next(err);
        } else {
          req.gAuth = auth;
          next();
        }
      });
    };
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
      headers: {
        authorization: `Bearer ${req.gAuth.access_token}`
      },
      qs: {
        personFields: 'names,emailAddresses'
      }
    };

    request(options)
      .then((result) => {
        const profile = JSON.parse(result);
        req.gProfile = {
          id: profile.resourceName.split('/').pop(),
          firstName: profile.names[0].givenName,
          lastName: profile.names[0].familyName
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
