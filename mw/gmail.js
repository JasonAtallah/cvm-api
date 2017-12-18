const request = require('request-promise');
const base64url = require('base64url');

var gmail = module.exports = new class GmailService {

  sendApprovalEmailToVendor(req, res, next) {
    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
      json: true,
      headers: {
        authorization: `Bearer ${req.email.accessToken}`
      },
      body: {
        raw: base64url(req.email.message)
      }
    };

    request(options)
      .then((result) => {
        req.result = result;
        next();
      })
      .catch(next);
  }

  sendRejectionEmailToVendor(req, res, next) {
    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
      json: true,
      headers: {
        authorization: `Bearer ${req.email.accessToken}`
      },
      body: {
        raw: base64url(req.email.message)
      }
    };

    request(options)
      .then((result) => {
        req.result = result;
        next();
      })
      .catch(next);
  }

}
