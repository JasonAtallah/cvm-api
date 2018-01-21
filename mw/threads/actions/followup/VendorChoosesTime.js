const mw = require('../../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepVendorChoosesTimeEmail,
  mw.gmail.sendEmail
]);
