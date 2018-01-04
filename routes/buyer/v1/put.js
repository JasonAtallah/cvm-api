const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.put('/emails/:templateId',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.mongo.buyer.updateEmailTemplate,
    mw.responses.sendOk(200));

  router.put('/gcalendar',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.logic.ifTruthyInReq('body.id',
      [
        mw.data.incoming.prepCalendar
      ],
      [
        mw.data.validation.validateNewCalendar,
        mw.gcalendar.createCalendar
      ]),
    mw.mongo.buyer.updateCalendar,
    mw.responses.sendOk(201));

  router.put('/schedule',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.mongo.buyer.updateSchedule,
    mw.responses.sendOk(204));

  router.put('/vendors/:vendorId/actions/:action',
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
      mw.data.incoming.prepBuyerAction,
      mw.data.incoming.prepThreadState,
      mw.logic.ifTrueInReq('stateChanged', [
        mw.mongo.vendors.updateThread,
        mw.threads.performActionFollowup
      ])
    ]),
    mw.compose([
      mw.data.responses.prepThreadForVendorResponse,
      mw.responses.sendReqVar('vendor')
    ]));

  return router;
};
