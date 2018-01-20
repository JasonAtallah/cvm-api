const gmail = require('googleapis').gmail('v1');
const base64url = require('base64url');
const config = require('../config');

module.exports = new class GmailService {

  sendEmail(req, res, next) {

    const auth = config.google.client;
    auth.credentials = req.buyer.gAuth;

    next();
    // gmail.users.messages.send({
    //   auth,
    //   userId: 'me',
    //   resource: {
    //     raw: base64url(req.email.message)
    //   }
    // }, function (err, response) {
    //   if (err) {
    //     next(err);
    //   } else {
    //     req.result = response;
    //     next();
    //   }
    // });
  }

}
