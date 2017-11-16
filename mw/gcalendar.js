const request = require('request-promise');
const moment = require('moment');
const GCalendarSpecs = require('../lib/gcalendar/specs');

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
  createCalendar(req, res, next) {
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
      .then((calendar) => {
        req.calendar = calendar;
        next();
      })
      .catch((err) => {
        next(err);
      });
  }

  createCalendarEvent(req, res, next) {
    let g_access_token = req.user.identities[0].access_token;

    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/calendar/v3/calendars/${req.buyer.gcalendar.id}/events`,
      json: true,
      headers: {
        authorization: `Bearer ${g_access_token}`
      },
      body: req.event
    };

    request(options)
      .then((event) => {
        req.event = event;
        next();
      })
      .catch((err) => {
        next(err);
      });
  }

  getCalendarList(req, res, next) {
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
  }
  
  getCalendarEvents(req, res, next) {
    let g_access_token = req.user.identities[0].access_token;
    let calendarId = req.buyer.gcalendar.id;

    var options = {
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
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
        req.events = JSON.parse(body);
        next();
      })
      .catch((err) => {
        next(err);
      });
  }

  mapCalendarList(req, res, next) {
    req.calendars = req.gcalendarlist.items
      .filter(GCalendarSpecs.calendarList_validCalendar)
      .map(GCalendarSpecs.calendar_mapToCommon);

    next();
  }

  mapCalendar(req, res, next) {
    req.calendar = GCalendarSpecs.calendar_mapToCommon(req.calendar);
    next();
  }

  mapCalendarEvent(req, res, next) {
    console.dir(req.event);
    next();
  }

  prepCalendar(req, res, next) {
    if (req.body.id) {
      req.calendar = req.body;
      next();
    } else if (req.body.name) {
      gcalendar.createCalendar(req, res, next);
    } else {
      next(new Error('no calendar provided'));
    }
  }

  prepCalendarEvent(req, res, next) {
    const timeParts = req.body.time.split(':');
    const startM = moment(req.body.date).set('hour', timeParts[0]).set('minute', timeParts[1]);
    req.event = {
      start: {
        dateTime: startM.toDate()
      },
      end: {
        dateTime: startM.add(req.body.duration, 'minutes').toDate()
      },
      summary: req.body.name,
      location: req.body.location
    };
    next();
  }
};
