const express = require('express');
const config = require('../../../config');
const mongo = require('../../../mw/mongo');
const parse = require('../../../mw/parse');
const responses = require('../../../mw/responses');
const sendGrid = require('../../../mw/sendGrid');

module.exports = function (app) {

  const router = express.Router();

  router.get('/questionnaires/:questionnaireId',
    mongo.prepQuestionnaireQueryById,
    mongo.getQuestionnaire,
    mongo.prepQuestionnaireForResponse,
    responses.sendReqVar('questionnaire'));

  // router.post('/vendors/:vendorId/submitQuestionnaire');
  router.post('/questionnaires/:questionnaireId/responses',
    parse.json,
    mongo.validateNewVendor,
    mongo.prepQuestionnaireQueryById,
    mongo.getQuestionnaire,
    mongo.prepNewVendorFromQuestionnaire,
    mongo.createVendor, // insert vendor
    mongo.prepVendorForResponse,
    responses.sendReqVar('vendor')
    );

  // router.put('/vendors/:vendorId/finalizeQuestionnaire');
  router.put('/questionnaires/:questionnaireId/responses/:responseId',
    parse.json,
    mongo.prepQuestionnaireResponseForUpdate,
    mongo.updateQuestionnaireResponse,
    responses.sendOk(201),
    mongo.prepBuyerQueryFromQuestionnaire,
    mongo.getBuyer,
    sendGrid.prepNewVendorEmailToBuyer,
    sendGrid.sendEmail,
  );

  router.post('/questionnaires/:questionnaireId/responses/:responseId/files',
    parse.file('file'),
    responses.sendReqVar('file'));

  router.get('/vendors/:vendorId',
    mongo.prepVendorQueryFromUrl,
    mongo.getVendor,
    mongo.prepVendorForResponse,
    responses.sendReqVar('vendor'));

  router.post('/vendors/:vendorId/rejectTimes');

  return router;
};
