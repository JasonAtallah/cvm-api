const config = require('../config');
const auth = require('./auth');
const gcalendar = require('./gcalendar');
const gmail = require('./gmail');
const logic = require('./logic');
const mongo = require('./mongo');
const parse = require('./parse');
const responses = require('./responses');
const sendGrid = require('./sendGrid');

module.exports = function (app) {
  /**
  Get buyer profile
  **/
  app.get('/api/buyer',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    logic.ifNullInReq('buyer', [
      auth.getMgr,
      auth.getGoogleProfile,
      mongo.createBuyer
    ]),
    responses.sendReqVar('buyer'));

  app.put('/api/buyer/email',
    auth.isLoggedIn,
    auth.getMgr,
    auth.getGoogleToken,
    parse.json,
    gmail.prepEmail,
    mongo.updateBuyerEmailTemplate,
    responses.sendOk(200));
  /**
  Set buyer's calendar
  **/
  app.put('/api/buyer/gcalendar',
    auth.isLoggedIn, // req.user
    auth.getMgr, // config.mgmt
    auth.getGoogleToken, // / req.gAccessToken
    parse.json, // parses req.body
    gcalendar.prepCalendar, // req.calendar
    mongo.updateCalendar, // updates buyer, req.buyer
    responses.sendOk(201));

  app.get('/api/calendars',
    auth.isLoggedIn,
    auth.getMgr,
    auth.getGoogleToken,
    parse.json,
    gcalendar.getCalendarList,
    gcalendar.prepCalendarListForResponse,
    responses.sendReqVar('calendars'));

  app.get('/api/events',
    auth.isLoggedIn,
    auth.getMgr,
    auth.getGoogleToken,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    gcalendar.getCalendarEvents,
    responses.sendReqVar('events'));

  app.post('/api/events',
    auth.isLoggedIn,
    auth.getMgr,
    auth.getGoogleToken,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    gcalendar.prepCalendarEvent,
    gcalendar.createCalendarEvent,
    responses.sendReqVar('event'));

  app.get('/api/questionnaires/:questionnaireId',
    mongo.prepQuestionnaireQueryById,
    mongo.getQuestionnaire,
    mongo.prepQuestionnaireForResponse,
    responses.sendReqVar('questionnaire'));

  app.post('/api/questionnaires/:questionnaireId/responses',
    parse.json,
    mongo.prepQuestionnaireQueryById,
    mongo.getQuestionnaire,
    mongo.prepNewVendorFromQuestionnaire,
    mongo.createVendor,
    mongo.prepVendorForResponse,
    responses.sendReqVar('vendor'),
    mongo.prepBuyerQueryFromQuestionnaire,
    mongo.getBuyer,
    sendGrid.prepNewVendorEmailToBuyer,
    sendGrid.sendEmail);

  app.put('/api/questionnaires/:questionnaireId/responses/:responseId',
    parse.json,
    mongo.prepQuestionnaireResponseForUpdate,
    mongo.updateQuestionnaireResponse,
    responses.sendOk(201));

  app.post('/api/questionnaires/:questionnaireId/responses/:responseId/files',
    parse.file('file'),
    responses.sendReqVar('file'));

  app.get('/api/vendors',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepVendorQueryFromBuyer,
    mongo.getVendors,
    responses.sendReqVar('vendors'));

  app.post('/api/vendors',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    mongo.prepNewVendorFromBuyer,
    mongo.createVendor,
    responses.sendReqVar('vendor'));

  app.put('/api/vendors/:vendorId/approve',
    auth.isLoggedIn,
    auth.getMgr,
    auth.getGoogleToken,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.approveVendor,
    gmail.sendApprovalEmailToVendor,
    responses.sendReqVar('vendor'));

  app.put('/api/vendors/:vendorId/reject',
    auth.isLoggedIn,
    auth.getMgr,
    auth.getGoogleToken,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.rejectVendor,
    gmail.sendRejectionEmailToVendor,
    // mongo.storeResult store result from rejection with datetime in vendor
    responses.sendReqVar('vendor'));
};
