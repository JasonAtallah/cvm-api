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
    mw.mongo.vendors.approveVendor,
    mw.gmail.sendApprovalEmailToVendor,
    mw.responses.sendReqVar('vendor'));

  router.put('/vendors/:vendorId/reject',
    mw.auth.isLoggedIn,
    mw.data.queries.prepBuyerQueryFromAuth,
    mw.mongo.get.buyer,
    mw.parse.json,
    mw.mongo.vendors.rejectVendor,
    mw.gmail.sendRejectionEmailToVendor,
    // mongo.storeResult store result from rejection with datetime in vendor
    mw.responses.sendReqVar('vendor'));

  return router;
};
