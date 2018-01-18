const _ = require('lodash');

module.exports = new class Mappings {

  mapGCalendarEventToEvent(event) {
    return {
      id: event.id,
      status: event.status,
      htmlLink: event.htmlLink,
      created: event.created,
      updated: event.updated,
      title: event.summary,
      startDate: event.start.dateTime,
      endDate: event.end.dateTime
    };
  }

  mapGCalendarToCalendar(calendar) {
    return {
      type: 'google',
      id: calendar.id,
      name: calendar.summary,
      timezone: calendar.timeZone      
    }; 
  }

  mapThreadToVendor(thread) {
    return Object.assign({}, thread.vendor, _.pick(thread, ['state', 'attributes']));
  }

  mapThreadToBuyer(thread) {
    return Object.assign({}, thread.buyer, _.pick(thread, ['state', 'attributes']));
  }
}
