const mw = require('../../../mw');

module.exports = mw.compose([
  mw.data.incoming.prepVendorRejectionEmail,
  mw.gmail.sendEmail
]);
