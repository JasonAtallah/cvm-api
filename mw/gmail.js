const request = require('request-promise');
const base64url = require('base64url');

var gmail = module.exports = new class GmailService {

  /**
  Inputs: req.buyer, req.vendor, req.body
  Outputs: req.result
  **/
  sendApprovalEmailToVendor(req, res, next) {
    var email = '';
    email += `To: ${req.vendor.contact.email} \r\n`;
    email += `Subject: ${req.body.subject} \r\n`;
    email += `\n${req.body.body}\n\nPlease Visit: ${req.body.scheduleUrl} to schedule a time to meet with the buyer.`;

    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
      json: true,
      headers: {
        authorization: `Bearer ${req.buyer.gAuth.accessToken}`
      },
      body: {
        raw: base64url(email)
      }
    };

    request(options)
      .then((result) => {
        req.result = result;
        next();
      })
      .catch(next);
  }

  /**
  Inputs: req.buyer
  Outputs: req.result
  **/
  sendRejectionEmailToVendor(req, res, next) {
    var email = '';
    email += `To: ${req.vendor.contact.email} \r\n`;
    email += `Subject: ${req.body.subject} \r\n`;
    email += `\r\n ${req.body.body}`;

    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
      json: true,
      headers: {
        authorization: `Bearer ${req.buyer.gAuth.accessToken}`
      },
      body: {
        raw: new Buffer(email).toString('base64')
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
