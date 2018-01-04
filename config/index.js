const path = require('path');
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;

const config = module.exports = {
  load: function () {
    _.extend(config, {
      app: {
        email: process.env.APP_EMAIL,
        host: process.env.APP_HOST,
        port: process.env.PORT
      },
      cors: {
        whitelist: process.env.CORS_WHITELIST.split(',')
      },
      env: process.env.NODE_ENV,
      google: {
        clientId: process.env.GOOGLE_CVM_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CVM_CLIENT_SECRET
      },
      jwt: {
        algorithm: process.env.JWT_ALGORITHM,
        audience: process.env.JWT_AUDIENCE,
        expiresIn: process.env.JWT_EXPIRESIN,
        secret: process.env.JWT_SECRET
      },
      mongo: {
        uri: process.env.MONGODB_URI
      },
      sendGrid: {
        apikey: process.env.SENDGRID_API_KEY
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
