const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.post('/events',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.buyer.get
    ]),
    mw.compose([
      mw.data.validation.validateNewEvent,
      mw.data.incoming.prepCalendarEventForInsert,
      mw.gcalendar.createCalendarEvent
    ]),
    mw.compose([
      mw.data.responses.prepCalendarEventForResponse,
      mw.responses.sendReqVar('event')
    ]));

  router.post('/locations',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.incoming.prepNewBuyerLocation,
      mw.data.queries.prepBuyerLocationInsert,
      mw.data.validation.validateNewLocation,
      mw.mongo.buyer.update
    ]),
    mw.compose([
      mw.responses.sendReqVar('location')
    ]));

  router.post('/vendors',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.validation.validateNewVendor,
      mw.data.incoming.prepNewVendorFromBuyer,
      mw.data.validation.validateVendor,
      mw.mongo.vendors.insertVendor
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.buyer.get
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
