const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.get('/questionnaires/:questionnaireId',
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),
    mw.data.queries.prepQuestionnaireQueryById,
    mw.mongo.get.questionnaire,
    mw.data.responses.prepQuestionnaireForResponse,
    mw.data.validation.validateReqVar('questionnaire', '/domain/questionnaire'),
    mw.responses.sendReqVar('questionnaire'));

  // router.post('/vendors/:vendorId/submitQuestionnaire');
  router.post('/questionnaires/:questionnaireId/responses',
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepQuestionnaireQueryById,
      mw.mongo.get.questionnaire
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromQuestionnaire,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.data.incoming.prepNewVendorFromQuestionnaire,
      mw.data.validation.validateReqVar('body', '/requests/new-vendor'),
      mw.mongo.vendors.insertVendor
    ]),
    mw.compose([
      mw.data.incoming.prepNewVendorThread,
      mw.data.validation.validateReqVar('thread', '/domain/thread'),
      mw.mongo.threads.insert
    ]),
    mw.compose([
      mw.data.responses.prepVendorForResponse,
      mw.data.validation.validateReqVar('vendor', '/domain/vendor'),
      mw.responses.sendReqVar('vendor')
    ]));

  // router.put('/vendors/:vendorId/finalizeQuestionnaire');
  router.put('/questionnaires/:questionnaireId/responses/:responseId',
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepQuestionnaireQueryById,
      mw.mongo.get.questionnaire
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromQuestionnaire,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.data.incoming.prepQuestionnaireResponseForUpdate,
      mw.data.validation.validateReqVar('response', '/domain/vendor'),
      mw.mongo.vendors.updateQuestionnaireResponse
    ]),
    mw.compose([
      mw.sendGrid.prepNewVendorEmailToBuyer,
      mw.data.validation.validateReqVar('sendGridMsg', '/primitives/sendgrid-email'),
      mw.sendGrid.sendEmail
    ]),
    mw.responses.send(201));

  router.post('/questionnaires/:questionnaireId/responses/:responseId/files',
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),

    mw.parse.file('file'),
    mw.data.validation.validateReqVar('file', '/primitives/file-object'),
    mw.responses.sendReqVar('file'));

  router.get('/vendors/:vendorId',
    mw.compose([
      mw.data.queries.prepVendorQueryFromUrl,
      mw.mongo.get.vendor
    ]),
    mw.compose([
      mw.data.responses.prepVendorForResponse,
      mw.data.validation.validateReqVar('vendor', '/domain/vendor'),
      mw.responses.sendReqVar('vendor')
    ]));

  router.get('/vendors/:vendorId/buyer',
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),
    mw.compose([
      mw.data.queries.prepThreadQueryForVendorInUrl,
      mw.mongo.get.thread
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsBuyerResponse,
      mw.data.validation.validateReqVar('buyer', '/responses/buyer-item'),
      mw.responses.sendReqVar('buyer')
    ]));

  router.put('/vendors/:vendorId/actions/:action',
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer,
    ]),
    mw.compose([
      mw.data.queries.prepVendorQueryFromUrl,
      mw.mongo.get.vendor,
    ]),
    mw.compose([
      mw.data.queries.prepThreadQueryForBuyerVendor,
      mw.mongo.get.thread,
    ]),
    mw.compose([
      mw.threads.loadCurrentState,
      mw.threads.createBuyerAction,
      mw.threads.performActionValidation,
      mw.threads.transitionThreadState,
      mw.logic.ifTrueInReq('stateChanged', [
        mw.mongo.threads.update,
        mw.threads.performActionFollowup
      ])
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsVendorResponse,
      mw.data.validation.validateReqVar('vendor', '/responses/vendor-item'),
      mw.responses.sendReqVar('vendor')
    ]));

  return router;
};
