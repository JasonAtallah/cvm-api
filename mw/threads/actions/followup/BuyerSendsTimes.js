const mw = require('../../../../mw');

module.exports = mw.compose([
  mw.data.emails.prepBuyerSendsTimesEmail,
  mw.gmail.sendEmail
]);
