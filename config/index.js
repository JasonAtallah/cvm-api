'use strict'

const path = require('path')
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;

const config = module.exports = {

  load: function() {

    _.extend(config, {
      port: process.env.PORT,
      auth0: {
        algorithm: process.env.AUTH0_ALGORITHM,
        audience: process.env.AUTH0_AUDIENCE,
        issuer: process.env.AUTH0_ISSUER,
        jwksUri: process.env.AUTH0_JWKS_URI
      },
      mongo: {
        uri: process.env.MONGODB_URI
      }
    });

    switch (process.env.NODE_ENV) {
      case "production":
      case "testing":
        _.extend(config, {});
        break;

      default:
        _.extend(config, {
          cors: {
            whitelist: ['http://localhost:8080']
          }
        });
    }

    let mongoDBResolve, mongoDBReject;
    config.mongo.getDB = new Promise(function(res, rej) {
      mongoDBResolve = res;
      mongoDBReject = rej;
    });

    MongoClient.connect(config.mongo.uri, function(err, db) {
      if (err !== null) {
        console.log("Mongo connection failure");
      } else {
        console.log("Connected successfully to mongo");
        mongoDBResolve(db);
      }
    });
  }
}
