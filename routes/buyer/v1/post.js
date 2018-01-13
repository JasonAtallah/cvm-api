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
      mw.data.validation.validateReqVar('body', 'new-event'),
      mw.data.incoming.prepCalendarEventForInsert,
      mw.gcalendar.createCalendarEvent
    ]),
    mw.compose([
      mw.data.responses.prepCalendarEventForResponse,
      mw.data.validation.validateReqVar('event', 'event'),
      mw.responses.sendReqVar('event')
    ]));

  router.post('/locations',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.validation.validateReqVar('body', 'location'),
      mw.data.incoming.prepNewBuyerLocation,
      mw.data.queries.prepBuyerLocationInsert,
      mw.mongo.buyer.update
    ]),
    mw.compose([
      mw.data.validation.validateReqVar('location', 'location'),
      mw.responses.sendReqVar('location')
    ]));

  router.post('/vendors',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.validation.validateReqVar('body', 'new-vendor'),
      mw.data.incoming.prepNewVendorFromBuyer,
      mw.data.validation.validateReqVar('vendor', 'vendor'),
      mw.mongo.vendors.insertVendor
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.buyer.get
    ]),
    mw.compose([
      mw.data.incoming.prepNewVendorThread,
      mw.data.validation.validateReqVar('thread', 'thread'),
      mw.mongo.threads.insert
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsVendorResponse,
      mw.data.validation.validateReqVar('vendor', 'vendor-item'),
      mw.responses.sendReqVar('vendor', 201)
    ]));

  return router;
};
