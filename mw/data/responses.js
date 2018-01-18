const _ = require('lodash');
const config = require('../../config');
const mappings = require('../../lib/mappings');

module.exports = {

  prepBuyerForResponse(req, res, next) {
    req.buyer = Object.assign(_.pick(req.buyer, ['_id', 'emails', 'gcalendar', 'gProfile', 'profile', 'schedule']), {
      firstName: req.buyer.gProfile.firstName,
      locations: req.buyer.locations || []
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
      .map(mappings.mapGCalendarToCalendar);
    next();
  },

  prepCalendarResponse(req, res, next) {
    req.calendar = mappings.mapGCalendarToCalendar(req.calendar);
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
    next();
  },

  prepVendorListForResponse(req, res, next) {
    req.vendors = req.vendors.map(mappings.mapThreadToVendor);
    next();
  }
};
