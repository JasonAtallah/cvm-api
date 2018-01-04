const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.post('/vendors/:vendorId/apptProposal',
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
      mw.data.incoming.prepBuyerSentNewTimesAction,
      mw.data.incoming.prepNewThreadState,
      mw.mongo.threads.updateOnAction
    ]),
    mw.responses.sendReqVar('thread')
  );

  router.post('/events',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.data.incoming.prepCalendarEventForInsert,
      mw.gcalendar.createCalendarEvent
    ]),
    mw.compose([
      mw.data.responses.prepCalendarEventForResponse,
      mw.responses.sendReqVar('event')
    ]));

  router.post('/vendors',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.incoming.prepNewVendorFromBuyer,
      mw.data.validation.validateNewVendor,
      mw.mongo.vendors.insertVendor
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.data.incoming.prepNewVendorThread,
      mw.mongo.threads.insert
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsVendorResponse,
      mw.responses.sendReqVar('vendor')
    ]));

  return router;
};
