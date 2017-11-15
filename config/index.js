'use strict';

const path = require('path');
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;

const config = module.exports = {
  load: function () {
    _.extend(config, {
      auth0: {
        algorithm: process.env.AUTH0_ALGORITHM,
        audience: process.env.AUTH0_AUDIENCE,
        issuer: process.env.AUTH0_ISSUER,
        jwksUri: process.env.AUTH0_JWKS_URI,
        client: {
          audience: process.env.AUTH0_CLIENT_AUDIENCE,
          id: process.env.AUTH0_CLIENT_ID,
          secret: process.env.AUTH0_CLIENT_SECRET
        }
      },
      mgmt: {
        accessToken: null
      },
      host: process.env.APP_HOST,
      mongo: {
        uri: process.env.MONGODB_URI
      },
      port: process.env.PORT,
      webApp: {
        host: process.env.WEB_APP_HOST
      }
    });

    _.extend(config, {
      cors: {
        whitelist: process.env.CORS_WHITELIST.split(',')
      }
    });

    switch (process.env.NODE_ENV) {
      case 'production':
      case 'testing':
        _.extend(config, {

        });
        break;

      default:
        _.extend(config, {

        });
    }

    let mongoDBResolve, mongoDBReject;
    config.mongo.getDB = new Promise(function (res, rej) {
      mongoDBResolve = res;
      mongoDBReject = rej;
    });

    MongoClient.connect(config.mongo.uri, function (err, db) {
      if (err !== null) {
        console.log('Mongo connection failure');
      } else {
        console.log('Connected successfully to mongo');
        mongoDBResolve(db);
      }
    });
  }
};
