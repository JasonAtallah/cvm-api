const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.post('/events',
    mw.auth.isLoggedIn,
    mw.data.queries.prepBuyerQueryFromAuth,
    mw.mongo.get.buyer,
    mw.parse.json,
    mw.gcalendar.prepCalendarEventForInsert,
    mw.gcalendar.createCalendarEvent,
    mw.gcalendar.prepCalendarEventForResponse,
    mw.responses.sendReqVar('event'));

  router.post('/vendors',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.incoming.prepNewVendorFromBuyer,
    mw.data.validation.validateNewVendor,
    mw.mongo.vendors.insertVendor,
    mw.data.queries.prepBuyerQueryFromAuth,
    mw.mongo.get.buyer,
    mw.data.incoming.prepNewVendorThread,
    mw.mongo.vendors.insertThread,
    mw.data.responses.prepNewThreadForVendorResponse,
    mw.responses.sendReqVar('vendor'));

  return router;
};
