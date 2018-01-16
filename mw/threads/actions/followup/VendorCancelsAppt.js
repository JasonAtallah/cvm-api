const mw = require('../../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepVendorCancelsApptEmail,
  // mw.gmail.sendEmail
]);
