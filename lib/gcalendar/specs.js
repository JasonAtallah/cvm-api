

module.exports = new class GCalendarSpecs
{
  calendarList_validCalendar(calendar) {
    return ['owner', 'writer'].indexOf(calendar.accessRole) >= 0 && calendar.primary !== true;
  }

  calendar_mapToCommon(calendar) {
    return {
      id: calendar.id,
      name: calendar.summary,
      tz: calendar.timeZone,
      notifications: calendar.notificationSettings ? calendar.notificationSettings.notifications : []
    };
  }
};
