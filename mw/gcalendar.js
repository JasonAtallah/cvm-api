const request = require('request-promise');

module.exports = {

  getCalendarList: function(req, res, next)
  {
    let g_access_token = req.user.identities[0].access_token;

    var options = {
      method: 'GET',
      url: `https://www.googleapis.com/calendar/v3/users/me/calendarList`,
      headers:
      {
        authorization: `Bearer ${g_access_token}`
      }
    };

    request(options)
      .then((body) =>
      {
        req.gcalendarlist = JSON.parse(body);
        next();
      });
  },

  mapCalendarList: function(req, res, next)
  {
    req.calendarlist = req.gcalendarlist.items
      .filter((i) => {
        return i.accessRole === 'owner';
      })
      .map((i) => {
        return {
          id: `gcalendar|${i.etag}|${i.kind}`,
          name: i.summary,
          tz: i.timeZone,
          notifications: i.notificationSettings ? i.notificationSettings.notifications : []
        };
      });

    next();
  }
}
