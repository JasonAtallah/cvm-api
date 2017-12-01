const request = require('request-promise');

var gmail = module.exports = new class GmailService {

  sendApprovalEmailToVendor(req, res, next) {
    var email = '';
    console.log(req.body);
    email += `To: ${req.vendor.contact.email} \r\n`;
    email += `Subject: ${req.body.subject} \r\n`;
    email += `\r\n ${req.body.body}`;

    var options = {
      method: 'POST',
      url: `https://www.googleapis.com/gmail/v1/users/me/messages/send`,
      json: true,
      headers: {
        authorization: `Bearer ${req.gAccessToken}`
      },
      body: {
        raw: new Buffer(email).toString('base64')        
      }
    };

    request(options)
      .then((result) => {
        console.dir(result);
        req.result = result;
        next();
      })
      .catch(next);
  }

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
        authorization: `Bearer ${req.gAccessToken}`
      },
      body: {
        raw: new Buffer(email).toString('base64')        
      }
    };

    request(options)
      .then((result) => {
        console.dir(result);
        req.result = result;
        next();
      })
      .catch(next);
  }

}