const request = require('request-promise');

var gmail = module.exports = new class GmailService {

  sendRejectionEmail(req, res, next) {
    var email = '';    
    email += `To: jason.atallah@gmail.com \r\n`;
    email += `Subject: hello \r\n`;
    email += `\r\n you've been rejected`;

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