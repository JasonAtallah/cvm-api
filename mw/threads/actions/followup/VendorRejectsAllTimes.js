const mw = require('../../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepVendorRejectsAllTimesEmail,
  mw.gmail.sendEmail
]);
