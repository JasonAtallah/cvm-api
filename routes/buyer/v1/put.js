const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.put('/emails/:templateId',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', '/requests/put-email-template'),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.data.queries.prepEmailTemplateUpdate,
      mw.mongo.buyer.updateEmailTemplate,
      mw.data.validation.validateReqVar('emails', '/responses/put-email-template'),
    ]),
    mw.responses.sendReqVar('emails'));

  router.put('/gcalendar',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer,
    ]),
    mw.logic.ifTruthyInReq('body.id',
      [
        mw.data.validation.validateReqVar('body', '/responses/calendar'),
        mw.data.incoming.prepCalendar
      ],
      [
        mw.data.validation.validateReqVar('body', '/requests/new-calendar'),
        mw.gcalendar.createCalendar,
        mw.data.responses.prepCalendarResponse
      ]),
    mw.mongo.buyer.updateCalendar,
    mw.data.validation.validateReqVar('calendar', '/responses/calendar'),
    mw.responses.sendReqVar('calendar'));

  router.put('/profile',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', '/requests/put-profile'),
    mw.data.incoming.prepBuyerProfileUpdate,
    mw.mongo.buyer.updateLoggedInBuyer,
    mw.responses.send(204));

  router.put('/questionnaire',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', '/requests/put-questionnaire'),
    mw.compose([
      mw.data.queries.prepQuestionnaireQueryFromAuth,
      mw.data.queries.prepQuestionnairePageUpdate,
      mw.mongo.questionnaires.update
    ]),
    mw.compose([
      mw.data.responses.prepQuestionnaireForResponse,
      mw.data.validation.validateReqVar('questionnaire', '/domain/questionnaire')
    ]),
    mw.responses.sendReqVar('questionnaire'));

  router.put('/schedule',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', '/domain/buyer-schedule'),
    mw.mongo.buyer.updateSchedule,
    mw.responses.send(204));

  router.put('/vendors/:vendorId/actions/:action',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('params', '/requests/buyer-action-params'),
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),
    mw.data.validation.validateReqVar('body', '/requests/buyer-action-{{params.action}}'),
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

  router.put('/vendors/:vendorId/attributes',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('params', '/requests/global-url-params'),
    mw.data.validation.validateReqVar('body', '/requests/put-vendor-attributes'),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.data.queries.prepVendorQueryFromUrl,
      mw.mongo.get.vendor
    ]),
    mw.compose([
      mw.data.queries.prepThreadQueryForVendorInUrl,
      mw.mongo.get.thread
    ]),
    mw.compose([
      mw.data.queries.prepThreadAttributeUpdate,
      mw.mongo.threads.updateAttributes
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsVendorResponse,
      mw.data.validation.validateReqVar('vendor', '/responses/vendor-item')
    ]),
    mw.responses.sendReqVar('vendor'));

  return router;
};
