

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
  
}
