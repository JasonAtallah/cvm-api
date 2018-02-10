const express = require('express');
const config = require('../../config');
const mw = require('../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.get('/buyer/login',
    mw.mongo.auth.saveLoginCallback,
    mw.auth.authenticateGoogle);

  router.get('/buyer/callback',
    mw.mongo.auth.lookupLoginCallback,
    mw.auth.convertGoogleCode,
    mw.auth.getGoogleProfile,
    mw.mongo.auth.updateGoogleAuthAndProfileForBuyer,
    mw.logic.ifNullInReq('buyer', [
      mw.mongo.buyer.initialize,
      mw.mongo.questionnaires.initialize
    ]),
    mw.auth.generateClientJWT,
    mw.mongo.auth.createClientCode,
    mw.auth.redirectToClient
  );

  if (config.env === 'testing') {
    router.post('/buyer/token',
      mw.parse.json,
      mw.data.validation.validateReqVar('body', 'buyer-token-request'),
      mw.data.queries.prepBuyerQueryFromBody,
      mw.mongo.get.buyer,
      mw.logic.ifNullInReq('buyer', [
        mw.responses.send(404, 'buyer not found')
      ], [
        mw.auth.generateClientJWT,
        mw.responses.sendReqVar('clientJWT')
      ]));
  }

  return router;
};
