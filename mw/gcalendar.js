const request = require('request-promise');
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const mappings = require('../lib/mappings');

var gcalendar = module.exports = new class GCalendarService {
  /**
  {
   "kind": "calendar#calendar",
   "etag": "\"BKjXnZpXR6E5ueFWG3UJk-2POYg/Eb3cjYfRPkXgpV5bwOsWP9nbrjc\"",
   "id": "5pa0qjf972g5cnir7fvpash98k@group.calendar.google.com",
   "summary": "Api Calendar 2",
   "timeZone": "America/Los_Angeles"
  }
  **/
  createCalendar (req, res, next) {
    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/calendar/v3/calendars`,
      json: true,
      headers: {
        authorization: `Bearer ${req.buyer.gAuth.accessToken}`
      },
      body: {
        summary: req.body.name,
        timeZone: req.body.timezone || 'America/Los_Angeles'
      }
    };

    request(options)
      .then((calendar) => {
        req.calendar = calendar;
        next();
      })
      .catch(next);
  }

  /**
  Inputs: req.buyer, req.event
  Outputs: req.event
  **/
  createCalendarEvent (req, res, next) {
    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/calendar/v3/calendars/${req.buyer.gcalendar.id}/events`,
      json: true,
      headers: {
        authorization: `Bearer ${req.buyer.gAuth.accessToken}`
      },
      body: req.event
    };

    request(options)
      .then((event) => {
        req.event = event;
        next();
      })
      .catch(next);
  }

  /**
  Inputs: req.buyer
  Outputs: req.gcalendarlist
  **/
  getCalendarList (req, res, next) {
    var options = {
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
      headers: {
        authorization: `Bearer ${req.buyer.gAuth.accessToken}`
      },
      qs: {
        minAccessRole: 'writer',
        showDeleted: false,
        showHidden: false
      }
    };

    request(options)
      .then((body) => {
        req.gcalendarlist = JSON.parse(body);
        next();
      })
      .catch(next);
  }

  /**
  Input: req.buyer
  Output: req.events
  **/
  getCalendarEvents (req, res, next) {
    var options = {
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/calendars/${req.buyer.gcalendar.id}/events`,
      headers: {
        authorization: `Bearer ${req.buyer.gAuth.accessToken}`
      },
      qs: {
        minAccessRole: 'writer',
        showDeleted: false,
        showHidden: false,
        timeZone: req.query.timezone
      }
    };

    request(options)
      .then((body) => {
        req.eventsResponse = JSON.parse(body);
        next();
      })
      .catch(next);
  }
};
