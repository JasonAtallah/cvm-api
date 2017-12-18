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

  prepCalendar (req, res, next) {
    if (req.body.id) {
      req.calendar = req.body;
      next();
    } else if (req.body.name) {
      gcalendar.createCalendar(req, res, next);
    } else {
      next(new Error('no calendar provided'));
    }
  }

  /**
  Input: req.body
  Output: req.event
  **/
  prepCalendarEventForInsert (req, res, next) {
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

  prepCalendarEventForResponse (req, res, next) {
    req.event = mapGCalendarEventToEvent(req.event);
    next();
  }

  /**
  Input: req.eventsResponse
  Output: req.events
  **/
  prepCalendarEventsForResponse (req, res, next) {
    req.events = req.eventsResponse.items.map(mappings.mapGCalendarEventToEvent);
    next();
  }

  /**
  Input: req.gcalendarlist
  Output: req.calendars
  **/
  prepCalendarListForResponse (req, res, next) {
    req.calendars = req.gcalendarlist.items
      .filter((calendar) => {
        return ['owner', 'writer'].indexOf(calendar.accessRole) >= 0 && calendar.primary !== true;
      })
      .map((calendar) => {
        return {
          type: 'google',
          id: calendar.id,
          name: calendar.summary,
          tz: calendar.timeZone,
          notifications: calendar.notificationSettings ? calendar.notificationSettings.notifications : []
        };
      });

    next();
  }
};
