'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const path = require('path');

const config = require('./config');
const routes = require('./mw/routes');

dotenv.load();
config.load();

const app = express();

app.use(cors({
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
  maxAge: 3600,
  origin: function (origin, callback) {
    if (config.cors.whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  }
}));

app.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: config.auth0.jwksUri
  }),
  audience: config.auth0.audience,
  issuer: config.auth0.issuer,
  algorithms: [config.auth0.algorithm]
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(app);

var server = app.listen(config.port, function () {
  console.log(`App is running on port ${config.port}`);
});
