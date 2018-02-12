const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.post('/events',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.data.validation.validateReqVar('body', '/requests/new-event'),
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
      mw.data.validation.validateReqVar('event', '/primitives/event'),
      mw.responses.sendReqVar('event')
    ]));

  router.post('/locations',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.validation.validateReqVar('body', '/primitives/location'),
      mw.data.incoming.prepNewBuyerLocation,
      mw.data.queries.prepBuyerLocationInsert,
      mw.mongo.buyer.update
    ]),
    mw.compose([
      mw.data.validation.validateReqVar('location', '/primitives/location'),
      mw.responses.sendReqVar('location')
    ]));

  router.post('/vendors',
    mw.auth.isLoggedIn,
    mw.parse.json,
    mw.compose([
      mw.data.validation.validateReqVar('body', '/requests/new-vendor'),
      mw.data.incoming.prepNewVendorFromBuyer,
      mw.data.validation.validateReqVar('vendor', '/domain/vendor'),
      mw.mongo.vendors.insertVendor
    ]),
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.get.buyer
    ]),
    mw.compose([
      mw.data.incoming.prepNewVendorThread,
      mw.data.validation.validateReqVar('thread', '/domain/thread'),
      mw.mongo.threads.insert
    ]),
    mw.compose([
      mw.data.responses.prepThreadAsVendorResponse,
      mw.data.validation.validateReqVar('vendor', '/responses/vendor-item'),
      mw.responses.sendReqVar('vendor', 201)
    ]));

  return router;
};
