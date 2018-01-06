const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.get('/questionnaires/:questionnaireId',
    mw.data.queries.prepQuestionnaireQueryById,
    mw.mongo.get.questionnaire,
    mw.data.responses.prepQuestionnaireForResponse,
    mw.responses.sendReqVar('questionnaire'));

  // router.post('/vendors/:vendorId/submitQuestionnaire');
  router.post('/questionnaires/:questionnaireId/responses',
    mw.parse.json,
    mw.compose([
      mw.data.incoming.prepNewVendorFromQuestionnaire,
      mw.data.validation.validateNewVendor,
      mw.mongo.vendors.insertVendor
    ]),
    mw.compose([
      mw.data.incoming.prepNewVendorThread,
      mw.mongo.threads.insert
    ]),
    mw.compose([
      mw.data.responses.prepVendorForResponse,
      mw.responses.sendReqVar('vendor')
    ]));

  // router.put('/vendors/:vendorId/finalizeQuestionnaire');
  router.put('/questionnaires/:questionnaireId/responses/:responseId',
    mw.parse.json,
    mw.compose([
      mw.data.incoming.prepQuestionnaireResponseForUpdate,
      mw.mongo.vendors.updateQuestionnaireResponse
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromQuestionnaire,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.sendGrid.prepNewVendorEmailToBuyer,
      mw.sendGrid.sendEmail
    ]),
    mw.responses.sendOk(201));

  router.post('/questionnaires/:questionnaireId/responses/:responseId/files',
    mw.parse.file('file'),
    mw.responses.sendReqVar('file'));

  router.get('/vendors/:vendorId',
    mw.compose([
      mw.data.queries.prepVendorQueryFromUrl,
      mw.mongo.get.vendor
    ]),
    mw.compose([
      mw.data.responses.prepVendorForResponse,
      mw.responses.sendReqVar('vendor')
    ]));

  router.get('/vendors/:vendorId/buyer',
    mw.compose([
      mw.data.queries.prepThreadQueryForVendorInUrl,
      mw.mongo.get.thread,
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsBuyerResponse,
      mw.responses.sendReqVar('buyer')
    ]));

  router.put('/vendors/:vendorId/actions/:action',
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepVendorQueryFromUrl,
      mw.mongo.get.vendor,
    ]),
    mw.compose([
      mw.data.queries.prepThreadQueryForVendorInUrl,
      mw.mongo.get.thread,
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromThread,
      mw.mongo.get.buyer,
    ]),
    mw.compose([
      mw.data.incoming.prepVendorAction,
      mw.data.incoming.prepThreadState,
      mw.logic.ifTrueInReq('stateChanged', [
        mw.mongo.threads.update,
        mw.threads.performActionFollowup
      ])
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsBuyerResponse,
      mw.responses.sendReqVar('buyer')
    ]));

  return router;
};
