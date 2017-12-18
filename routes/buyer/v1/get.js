const express = require('express');
const config = require('../../../config');
const auth = require('../../../mw/auth');
const gcalendar = require('../../../mw/gcalendar');
const gmail = require('../../../mw/gmail');
const logic = require('../../../mw/logic');
const mongo = require('../../../mw/mongo');
const parse = require('../../../mw/parse');
const responses = require('../../../mw/responses');
const sendGrid = require('../../../mw/sendGrid');

module.exports = function (app) {

  const router = express.Router();

  router.get('/buyer',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepBuyerForResponse,
    responses.sendReqVar('buyer'));

  router.get('/token',
    mongo.getTokenForCode,
    responses.sendReqVar('token'));

  router.get('/calendars',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    gcalendar.getCalendarList,
    gcalendar.prepCalendarListForResponse,
    responses.sendReqVar('calendars'));

  router.get('/events',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    gcalendar.getCalendarEvents,
    gcalendar.prepCalendarEventsForResponse,
    responses.sendReqVar('events'));

  router.get('/vendors',
    auth.isLoggedIn,
    mongo.prepVendorListQueryForLoggedInBuyer,
    mongo.getVendors,
    mongo.prepVendorListForReponse,
    responses.sendReqVar('vendors'));

  router.get('/vendors/:vendorId',
    auth.isLoggedIn,
    mongo.prepVendorQueryFromUrlForLoggedInBuyer,
    mongo.getVendor,
    mongo.prepVendorForResponse,
    responses.sendReqVar('vendor'));

  router.get('/vendors/:vendorId/files/:fileId',
    auth.isLoggedIn,
    mongo.prepVendorQueryFromUrlForLoggedInBuyer,
    mongo.getVendor,
    mongo.locateFileInVendor,
    mongo.sendFile
  );

  return router;
};
