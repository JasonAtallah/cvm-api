const mw = require('../../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepRejectVendorEmail,
  // mw.gmail.sendEmail
]);
