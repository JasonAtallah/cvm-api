const mw = require('../../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepBuyerCancelsApptEmail,
  // mw.gmail.sendEmail
]);
