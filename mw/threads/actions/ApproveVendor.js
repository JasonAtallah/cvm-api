const mw = require('../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepApproveVendorEmail,
  // mw.gmail.sendEmail
]);
