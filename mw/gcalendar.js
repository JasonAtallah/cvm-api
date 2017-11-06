const request = require('request-promise');
const bindAll = require('lodash.bindall');
const GCalendarSpecs = require('../lib/gcalendar/specs');

module.exports = bindAll({

  /**
  {
   "kind": "calendar#calendar",
   "etag": "\"BKjXnZpXR6E5ueFWG3UJk-2POYg/Eb3cjYfRPkXgpV5bwOsWP9nbrjc\"",
   "id": "5pa0qjf972g5cnir7fvpash98k@group.calendar.google.com",
   "summary": "Api Calendar 2",
   "timeZone": "America/Los_Angeles"
  }
  **/
  createCalendar: function (req, res, next) {
    let g_access_token = req.user.identities[0].access_token;

    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/calendar/v3/calendars`,
      json: true,
      headers: {
        authorization: `Bearer ${g_access_token}`
      },
      body: {
        summary: req.body.name,
        timeZone: req.body.timezone || 'America/Los_Angeles'
      }
    };

    request(options)
      .then((body) => {
        req.calendar = JSON.parse(body);
        next();
      })
      .catch((err) => {
        next(err);
      });
  },

  getCalendarList: function (req, res, next) {
    let g_access_token = req.user.identities[0].access_token;

    var options = {
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
      headers: {
        authorization: `Bearer ${g_access_token}`
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
      .catch((err) => {
        next(err);
      });
  },

  mapCalendarList: function (req, res, next) {
    req.calendars = req.gcalendarlist.items
      .filter(GCalendarSpecs.calendarList_validCalendar)
      .map(GCalendarSpecs.calendar_mapToCommon);

    next();
  },

  mapCalendar: function (req, res, next) {
    req.calendar = GCalendarSpecs.calendar_mapToCommon(req.calendar);
    next();
  },

  prepCalendar(req, res, next) {
    if (req.body.id) {
      req.calendar = req.body;
      next();
    } else if (req.body.name) {
      this.createCalendar(req, res, next);
    } else {
      next(new Error('no calendar provided'));
    }
  }
});
