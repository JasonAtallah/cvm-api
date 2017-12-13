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
  app.get('/api/buyer',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepBuyerForResponse,
    responses.sendReqVar('buyer'));

  app.get('/api/buyer/token',
    mongo.getTokenForCode,
    responses.sendReqVar('token'));

  app.put('/api/buyer/emails/:templateId',
    auth.isLoggedIn,
    parse.json,
    mongo.updateBuyerEmailTemplate,
    responses.sendOk(200));

  app.put('/api/buyer/gcalendar',
    auth.isLoggedIn,
    parse.json,
    gcalendar.prepCalendar,
    mongo.updateCalendar,
    responses.sendOk(201));

  app.put('/api/buyer/schedule',
    auth.isLoggedIn,
    parse.json,
    mongo.updateBuyerSchedule,
    responses.sendOk(204));

  app.get('/api/calendars',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    gcalendar.getCalendarList,
    gcalendar.prepCalendarListForResponse,
    responses.sendReqVar('calendars'));

  app.get('/api/events',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    gcalendar.getCalendarEvents,
    responses.sendReqVar('events'));

  app.post('/api/events',
    auth.isLoggedIn,
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
    mongo.validateNewVendor,
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

  app.get('/api/vendors/:vendorId',
    auth.isLoggedIn,
    mongo.prepBuyersVendorQueryFromUrl,
    mongo.getVendor,
    mongo.prepVendorForResponse,
    responses.sendReqVar('vendor'));

  app.get('/api/vendors/:vendorId/files/:fileId',
    auth.isLoggedIn,
    mongo.prepBuyersVendorQueryFromUrl,
    mongo.getVendor,
    mongo.locateFileInVendor,
    mongo.sendFile
  );

  app.post('/api/vendors',
    auth.isLoggedIn,
    parse.json,
    mongo.validateNewVendor,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepNewVendorFromBuyer,
    mongo.createVendor,
    responses.sendReqVar('vendor'));

  app.put('/api/vendors/:vendorId/approve',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    mongo.approveVendor,
    gmail.sendApprovalEmailToVendor,
    responses.sendReqVar('vendor'));

  app.put('/api/vendors/:vendorId/reject',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    mongo.rejectVendor,
    gmail.sendRejectionEmailToVendor,
    // mongo.storeResult store result from rejection with datetime in vendor
    responses.sendReqVar('vendor'));
};
