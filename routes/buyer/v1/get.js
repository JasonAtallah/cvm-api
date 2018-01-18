const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  router.get('/buyer',
    mw.auth.isLoggedIn,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.buyer.get,
      mw.data.responses.prepBuyerForResponse,
      mw.data.validation.validateReqVar('buyer', 'buyer-public'),
      mw.responses.sendReqVar('buyer')
    ]));

  router.get('/token',
    mw.mongo.auth.getTokenForCode,
    mw.data.validation.validateReqVar('token', 'jwt-token'),
    mw.responses.sendReqVar('token'));

  router.get('/calendars',
    mw.auth.isLoggedIn,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.buyer.get
    ]),
    mw.compose([
      mw.gcalendar.getCalendarList,
      mw.data.responses.prepCalendarListForResponse,
      mw.data.validation.validateReqVar('calendars', 'calendars'),
      mw.responses.sendReqVar('calendars')
    ]));

  router.get('/events',
    mw.auth.isLoggedIn,
    mw.compose([
      mw.data.queries.prepBuyerQueryFromAuth,
      mw.mongo.buyer.get
    ]),
    mw.compose([
      mw.gcalendar.getCalendarEvents,
      mw.data.responses.prepCalendarEventsForResponse,
      mw.data.validation.validateReqVar('events', 'events'),
      mw.responses.sendReqVar('events')
    ]));

  router.get('/vendors',
    mw.auth.isLoggedIn,
    mw.compose([
      mw.data.queries.prepVendorListQueryForLoggedInBuyer,
      mw.mongo.get.vendorList,
      mw.data.responses.prepVendorListForResponse,
      mw.data.validation.validateReqVar('vendors', 'vendors'),
      mw.responses.sendReqVar('vendors')
    ]));

  router.get('/vendors/:vendorId',
    mw.auth.isLoggedIn,
    mw.compose([
      mw.data.queries.prepVendorQueryFromUrl,
      mw.mongo.get.vendor,
      mw.data.responses.prepVendorForResponse,
      mw.data.validation.validateReqVar('vendor', 'vendor'),
      mw.responses.sendReqVar('vendor')
    ]));

  router.get('/vendors/:vendorId/files/:fileId',
    mw.auth.isLoggedIn,
    mw.compose([
      mw.data.queries.prepVendorQueryFromUrl,
      mw.mongo.get.vendor
    ]),
    mw.compose([
      mw.data.utils.locateFileInVendor,
      mw.data.validation.validateReqVar('file', 'file-object'),
      mw.mongo.files.stream
    ]));

  return router;
};
