const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');

module.exports = {

  createClientCode(req, res, next) {
    const record = {
      token: req.clientJWT,
      code: Math.random().toString().slice(2)
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('clientCodes').insert(record)
          .then((result) => {
            req.clientCode = record.code;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  getTokenForCode(req, res, next) {
    const query = {
      code: req.query.code
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('clientCodes').findOneAndDelete(query)
          .then((result) => {
            if (result) {
              req.token = result.value.token;
              next();
            } else {
              const err = new Error('Invalid code');
              err.status = 400;
              next(err);
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  lookupLoginCallback(req, res, next) {
    const query = {
      _id: new ObjectID(req.query.state)
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('logins').findOneAndDelete(query)
          .then((result) => {
            req.loginCallback = result.value.callback;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  saveLoginCallback(req, res, next) {
    const record = {
      callback: req.query.callback
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('logins').insert(record)
          .then((result) => {
            req.loginCallback = result.ops[0];
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  /**
  Inputs: req.gAuth, req.gProfile
  **/
  updateGoogleAuthAndProfileForBuyer(req, res, next) {
    const select = {
      'gProfile.id': req.gProfile.id
    };

    const update = {
      $set: {
        gProfile: req.gProfile,
        'gAuth.accessToken': req.gAuth.access_token,
        'gAuth.refreshToken': req.gAuth.refresh_token,
        'gAuth.tokenType': req.gAuth.token_type,
        'gAuth.expiryDate': req.gAuth.expiry_date
      }
    };

    const options = {
      upsert: true
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').findOneAndUpdate(select, update, options)
          .then((result) => {
            req.buyer = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  }

};
