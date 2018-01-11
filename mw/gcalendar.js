const gcalendar = require('googleapis').calendar('v3');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const config = require('../config');
const mappings = require('../lib/mappings');

module.exports = new class GCalendarService {

  createCalendar (req, res, next) {
    const auth = config.google.client;
    auth.credentials = req.buyer.gAuth;

    gcalendar.calendars.insert({
      auth,
      resource: {
        summary: req.body.name,
        timeZone: req.body.timezone
      }
    }, function (err, response) {
      if (err) {
        next(err);
      } else {
        req.calendar = response;
        next();
      }
    });
  }

  createCalendarEvent (req, res, next) {
    const auth = config.google.client;
    auth.credentials = req.buyer.gAuth;

    gcalendar.events.insert({
      auth,
      calendarId: req.buyer.gcalendar.id,
      resource: req.event
    }, function (err, response) {
      if (err) {
        next(err);
      } else {
        req.event = response;
        next();
      }
    });
  }

  getCalendarList (req, res, next) {
    const auth = config.google.client;
    auth.credentials = req.buyer.gAuth;

    gcalendar.calendarList.list({
      auth,
      minAccessRole: 'writer',
      showDeleted: false,
      showHidden: false
    }, function (err, response) {
      if (err) {
        next(err);
      } else {
        req.gcalendarlist = response;
        next();
      }
    });
  }

  getCalendarEvents (req, res, next) {
    const auth = config.google.client;
    auth.credentials = req.buyer.gAuth;

    gcalendar.events.list({
      auth,
      calendarId: req.buyer.gcalendar.id,
      minAccessRole: 'writer',
      showDeleted: false,
      showHidden: false,
      timeZone: req.query.timezone
    }, function (err, response) {
      if (err) {
        next(err);
      } else {
        req.eventsResponse = response;
        next();
      }
    });
  }
};
