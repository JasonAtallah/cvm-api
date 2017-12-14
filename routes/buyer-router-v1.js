const express = require('express');
const config = require('../config');
const auth = require('../mw/auth');
const gcalendar = require('../mw/gcalendar');
const gmail = require('../mw/gmail');
const logic = require('../mw/logic');
const mongo = require('../mw/mongo');
const parse = require('../mw/parse');
const responses = require('../mw/responses');
const sendGrid = require('../mw/sendGrid');

module.exports = function (app) {

  const router = express.Router();

  router.get('/buyer',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepBuyerForResponse,
    responses.sendReqVar('buyer'));

  router.get('/buyer/token',
    mongo.getTokenForCode,
    responses.sendReqVar('token'));

  router.put('/buyer/emails/:templateId',
    auth.isLoggedIn,
    parse.json,
    mongo.updateBuyerEmailTemplate,
    responses.sendOk(200));

  router.put('/buyer/gcalendar',
    auth.isLoggedIn,
    parse.json,
    gcalendar.prepCalendar,
    mongo.updateCalendar,
    responses.sendOk(201));

  router.put('/buyer/schedule',
    auth.isLoggedIn,
    parse.json,
    mongo.updateBuyerSchedule,
    responses.sendOk(204));

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

  router.post('/events',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    gcalendar.prepCalendarEventForInsert,
    gcalendar.createCalendarEvent,
    gcalendar.prepCalendarEventForResponse,
    responses.sendReqVar('event'));

  router.get('/vendors',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepVendorQueryFromBuyer,
    mongo.getVendors,
    responses.sendReqVar('vendors'));

  router.get('/vendors/:vendorId',
    auth.isLoggedIn,
    mongo.prepBuyersVendorQueryFromUrl,
    mongo.getVendor,
    mongo.prepVendorForResponse,
    responses.sendReqVar('vendor'));

  router.get('/vendors/:vendorId/files/:fileId',
    auth.isLoggedIn,
    mongo.prepBuyersVendorQueryFromUrl,
    mongo.getVendor,
    mongo.locateFileInVendor,
    mongo.sendFile
  );

  router.post('/vendors',
    auth.isLoggedIn,
    parse.json,
    mongo.validateNewVendor,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepNewVendorFromBuyer,
    mongo.createVendor,
    responses.sendReqVar('vendor'));

  router.put('/vendors/:vendorId/approve',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    mongo.approveVendor,
    gmail.sendApprovalEmailToVendor,
    responses.sendReqVar('vendor'));

  router.put('/vendors/:vendorId/reject',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    mongo.rejectVendor,
    gmail.sendRejectionEmailToVendor,
    // mongo.storeResult store result from rejection with datetime in vendor
    responses.sendReqVar('vendor'));

  return router;
};
