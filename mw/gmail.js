const request = require('request-promise');

var gmail = module.exports = new class GmailService {
  
  prepEmail(req, res, next) {
    console.log(req.body);
    req.email = req.body.email;
    next();
  }

  sendApprovalEmailToVendor(req, res, next) {
    var email = '';
    email += `To: ${req.vendor.contact.email} \r\n`;
    email += `Subject: ${req.buyer.emails.approveVendor.subject} \r\n`;
    email += `\r\n ${req.buyer.emails.approveVendor.body}`;

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
    email += `Subject: ${req.buyer.emails.rejectVendor.subject} \r\n`;
    email += `\r\n ${req.buyer.emails.rejectVendor.body}`;

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