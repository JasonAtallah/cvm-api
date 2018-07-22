const sgMail = require('@sendgrid/mail');
const config = require('../config');

sgMail.setApiKey(config.sendGrid.apikey);

var sendGrid = module.exports = new class SendGridService {

  prepNewVendorEmailToBuyer(req, res, next) {
    // req.sendGridMsg = {
    //   to: req.buyer.gProfile.email,
    //   from: config.app.email,
    //   subject: req.buyer.emails.newVendor.subject,
    //   text: req.buyer.emails.newVendor.body
    // };
    next();
  }

  // Inputs: req.sendGridMsg
  // Outputs: req.sendGridResult, req.sendGridErr
  sendEmail(req, res, next) {
    sgMail.send(req.sendGridMsg)
      .then((result) => {
        req.sendGridResult = result;
        next();
      })
      .catch((err) => {
        req.sendGridErr = err;
        console.dir(err);
        next();
      });
  }
}
