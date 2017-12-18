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
    mw.data.incoming.prepNewVendorFromQuestionnaire,
    mw.data.validation.validateNewVendor,
    mw.mongo.vendors.insertVendor,
    mw.data.queries.prepQuestionnaireQueryById,
    mw.data.incoming.prepNewVendorThread,
    mw.mongo.vendors.insertThread,
    mw.data.responses.prepVendorForResponse,
    mw.responses.sendReqVar('vendor'));

  // router.put('/vendors/:vendorId/finalizeQuestionnaire');
  router.put('/questionnaires/:questionnaireId/responses/:responseId',
    mw.parse.json,
    mw.data.incoming.prepQuestionnaireResponseForUpdate,
    mw.mongo.vendors.updateQuestionnaireResponse,
    mw.responses.sendOk(201),
    mw.data.queries.prepBuyerQueryFromQuestionnaire,
    mw.mongo.get.buyer,
    mw.sendGrid.prepNewVendorEmailToBuyer,
    mw.sendGrid.sendEmail);

  router.post('/questionnaires/:questionnaireId/responses/:responseId/files',
    mw.parse.file('file'),
    mw.responses.sendReqVar('file'));

  router.get('/vendors/:vendorId',
    mw.data.queries.prepVendorQueryFromUrl,
    mw.mongo.get.vendor,
    mw.data.responses.prepVendorForResponse,
    mw.responses.sendReqVar('vendor'));

  router.post('/vendors/:vendorId/rejectTimes');

  return router;
};
