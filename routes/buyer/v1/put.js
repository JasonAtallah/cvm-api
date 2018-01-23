const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.put('/emails/:templateId',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', 'email-template'),
    mw.mongo.buyer.updateEmailTemplate,
    mw.responses.send(200));

  router.put('/gcalendar',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer,
    ]),
    mw.logic.ifTruthyInReq('body.id',
      [
        mw.data.validation.validateReqVar('body', 'calendar'),
        mw.data.incoming.prepCalendar
      ],
      [
        mw.data.validation.validateReqVar('body', 'new-calendar'),
        mw.gcalendar.createCalendar,
        mw.data.responses.prepCalendarResponse
      ]),
    mw.mongo.buyer.updateCalendar,
    mw.data.validation.validateReqVar('calendar', 'calendar'),
    mw.responses.sendReqVar('calendar'));

  router.put('/profile',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', 'buyer-profile'),
    mw.data.incoming.prepBuyerProfileUpdate,
    mw.mongo.buyer.updateLoggedInBuyer,
    mw.responses.send(204));

  router.put('/schedule',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', 'buyer-schedule'),
    mw.mongo.buyer.updateSchedule,
    mw.responses.send(204));

  router.put('/vendors/:vendorId/actions/:action',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('params', 'buyer-action-params'),
    mw.data.validation.validateReqVar('params', 'global-url-params'),
    mw.data.validation.validateReqVar('body', 'buyer-action-{{params.action}}'),
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
      mw.data.validation.validateReqVar('vendor', 'vendor-item'),
      mw.responses.sendReqVar('vendor')
    ]));

  router.put('/vendors/:vendorId/attributes/:attribute',
    mw.data.validation.validateReqVar('params', 'global-url-params'),
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
      mw.data.queries.prepThreadQueryForVendorInUrl,
      mw.mongo.get.thread,
    ]),
    mw.compose([
      mw.data.incoming.prepThreadAttribute,
      mw.logic.ifNotUndefinedInReq('attribute', [
        mw.mongo.threads.updateAttribute,
      ]),
      mw.data.responses.prepThreadAsVendorResponse,
      mw.data.validation.validateReqVar('vendor', 'vendor-item'),
      mw.responses.sendReqVar('vendor')
    ])
  );

  return router;
};
