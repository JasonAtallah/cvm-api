const config = require('../config');
const auth = require('./auth');
const parse = require('./parse');
const gcalendar = require('./gcalendar');
const mongo = require('./mongo');
const responses = require('./responses');

module.exports = function (app) {
  app.get('/api/buyer',
    auth.isLoggedIn,
    /* auth.isBuyer */
    mongo.prepBuyerQuery(),
    mongo.getBuyer,
    mongo.cleanBuyer,
    responses.sendReqVar('buyer'));

  app.put('/api/buyer/gcalendar',
    auth.isLoggedIn,
    /* auth.isBuyer */
    auth.getMgr,
    auth.getUser,
    parse.json,
    gcalendar.prepCalendar,
    mongo.updateCalendar,
    responses.sendOk());

  app.get('/api/calendars',
    auth.isLoggedIn,
    /* auth.isBuyer */
    auth.getMgr,
    auth.getUser,
    parse.json,
    gcalendar.getCalendarList,
    gcalendar.mapCalendarList,
    responses.sendReqVar('calendars'));

  app.post('/api/calendar',
    auth.isLoggedIn,
    /* auth.isBuyer */
    auth.getMgr,
    auth.getUser,
    parse.json,
    gcalendar.createCalendar,
    gcalendar.mapCalendar,
    responses.sendReqVar('calendar'));

  app.get('/api/events',
    auth.isLoggedIn,
    /* auth.isBuyer */
    auth.getMgr,
    auth.getUser,
    mongo.prepBuyerQuery(),
    mongo.getBuyer,
    gcalendar.getCalendarEvents,
    responses.sendReqVar('events'));

  app.post('/api/events',
    auth.isLoggedIn,
    /* auth.isBuyer */
    auth.getMgr,
    auth.getUser,
    mongo.prepBuyerQuery(),
    mongo.getBuyer,
    parse.json,
    gcalendar.prepCalendarEvent,
    gcalendar.createCalendarEvent,
    gcalendar.mapCalendarEvent,
    responses.sendReqVar('event'));

  app.post('/api/files',
    parse.file,
    responses.sendReqVar('file'));

  app.get('/api/questionnaire',
    /*isVendor,*/
    mongo.prepBuyerQuery('hardcoded'),
    mongo.getBuyer,
    mongo.extractQuestionnaire,
    responses.sendReqVar('questionnaire'));

  app.get('/api/vendors',
    auth.isLoggedIn,
    /* auth.isBuyer */
    mongo.getVendors,
    responses.sendReqVar('vendors'));

  app.post('/api/vendors',
    auth.isLoggedIn,
    /* auth.isBuyer */
    parse.json,
    mongo.createVendor,
    responses.sendReqVar('vendor'));

  app.put('/api/vendors/:vendorId/approve',
    auth.isLoggedIn,
    /* auth.isBuyer */
    mongo.approveVendor,
    responses.sendReqVar('vendor')
    /* TODO: send email... */);

  app.put('/api/vendors/:vendorId/reject',
    auth.isLoggedIn,
    /* auth.isBuyer */
    mongo.rejectVendor,
    responses.sendReqVar('vendor')
/* TODO: send email... */);
};
