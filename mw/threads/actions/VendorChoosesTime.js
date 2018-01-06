const mw = require('../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepBuyerEmailOfVendorChoosesTime,
  mw.gmail.sendEmail
]);
