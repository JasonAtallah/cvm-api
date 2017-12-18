const express = require('express');
const config = require('../../config');
const auth = require('../../mw/auth');
const mongo = require('../../mw/mongo');
const logic = require('../../mw/logic');

module.exports = function (app) {

  const router = express.Router();

  router.get('/buyer/login',
    mongo.saveLoginCallback,
    auth.authenticateGoogle(`${config.app.host}/buyer/callback`));

  router.get('/buyer/callback',
    mongo.lookupLoginCallback,
    auth.convertGoogleCode(`${config.app.host}/buyer/callback`),
    auth.getGoogleProfile,
    mongo.updateGoogleAuthAndProfileForBuyer,
    logic.ifNullInReq('buyer', [
      mongo.initializeBuyer
    ]),
    auth.generateClientJWT,
    mongo.createClientCode,
    auth.redirectToClient
  );

  return router;
};
