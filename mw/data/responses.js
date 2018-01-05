const _ = require('lodash');
const config = require('../../config');
const mappings = require('../../lib/mappings');

module.exports = {

  prepBuyerForResponse(req, res, next) {
    req.buyer = Object.assign(_.pick(req.buyer, ['_id', 'profile', 'emails', 'gcalendar', 'gProfile', 'schedule']), {
      firstName: req.buyer.gProfile.firstName
    });
    next();
  },

  prepCalendarEventForResponse (req, res, next) {
    req.event = mappings.mapGCalendarEventToEvent(req.event);
    next();
  },

  prepCalendarEventsForResponse (req, res, next) {
    req.events = req.eventsResponse.items.map(mappings.mapGCalendarEventToEvent);
    next();
  },

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
  },

  prepThreadAsBuyerResponse(req, res, next) {
    req.buyer = mappings.mapThreadToBuyer(req.thread);
    next();
  },

  prepThreadAsVendorResponse(req, res, next) {
    req.vendor = mappings.mapThreadToVendor(req.thread);
    next();
  },

  prepQuestionnaireForResponse(req, res, next) {
    req.questionnaire = _.omit(req.questionnaire, ['buyerId']);
    next();
  },

  prepVendorForResponse(req, res, next) {
    req.vendor = _.omit(req.vendor, ['buyerId']);
    next();
  },

  prepVendorListForResponse(req, res, next) {
    req.vendors = req.vendors.map(mappings.mapThreadToVendor);
    next();
  }
};
