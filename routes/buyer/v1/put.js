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
    mw.gcalendar.prepCalendar,
    mw.mongo.buyer.updateCalendar,
    mw.responses.sendOk(201));

  router.put('/schedule',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.mongo.buyer.updateSchedule,
    mw.responses.sendOk(204));

  router.put('/vendors/:vendorId/approve',
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
      mw.data.incoming.prepApproveVendorAction,
      mw.data.incoming.prepNewThreadState,
      mw.mongo.vendors.updateThreadOnAction
    ]),
    mw.compose([
      mw.data.incoming.prepVendorApprovalEmail,
      mw.gmail.sendApprovalEmailToVendor
    ]),
    mw.responses.sendReqVar('vendor'));

  router.put('/vendors/:vendorId/reject',
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
      mw.data.incoming.prepRejectVendorAction,
      mw.data.incoming.prepNewThreadState,
      mw.mongo.vendors.updateThreadOnAction
    ]),
    mw.compose([
      mw.data.incoming.prepVendorRejectionEmail,
      mw.gmail.sendRejectionEmailToVendor
    ]),
    mw.compose([
      mw.data.responses.prepThreadForVendorResponse,
      mw.responses.sendReqVar('vendor')
    ]));

  router.put('/vendors/:vendorId/attributes/:attribute', 
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
        mw.mongo.threads.updateThreadAttribute,
      ]),
      mw.responses.sendReqVar('thread.buyer')    
    ])
  );

  return router;
};
