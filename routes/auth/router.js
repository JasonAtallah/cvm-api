const express = require('express');
const config = require('../../config');
const mw = require('../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.get('/buyer/login',
    mw.mongo.auth.saveLoginCallback,
    mw.auth.authenticateGoogle(`${config.app.host}/buyer/callback`));

  router.get('/buyer/callback',
    mw.mongo.auth.lookupLoginCallback,
    mw.auth.convertGoogleCode(`${config.app.host}/buyer/callback`),
    mw.auth.getGoogleProfile,
    mw.mongo.auth.updateGoogleAuthAndProfileForBuyer,
    mw.logic.ifNullInReq('buyer', [
      mw.mongo.buyer.initialize
    ]),
    mw.auth.generateClientJWT,
    mw.mongo.auth.createClientCode,
    mw.auth.redirectToClient
  );

  return router;
};
