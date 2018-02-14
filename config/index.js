const path = require('path');
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const google = require('googleapis');

const config = module.exports = {
  load: function () {
    const rootDir = path.resolve(__dirname, '..');

    _.extend(config, {
      app: {
        email: process.env.APP_EMAIL,
        host: process.env.APP_HOST,
        dirs: {
          schemas: path.resolve(rootDir, 'model/schemas')
        },
        port: process.env.PORT
      },
      cors: {
        whitelist: process.env.CORS_WHITELIST.split(',')
      },
      env: process.env.NODE_ENV,
      google: {
        get client() {
          return new google.auth.OAuth2(
            process.env.GOOGLE_CVM_CLIENT_ID,
            process.env.GOOGLE_CVM_CLIENT_SECRET,
            `${process.env.APP_HOST}/buyer/callback`
          );
        },
        scopes: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email',
          'https://www.googleapis.com/auth/gmail.modify',
          'https://www.googleapis.com/auth/calendar'
        ]
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

    if (process.env.NODE_ENV === 'testing') {
      config.mongo.uri += '-test';
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
