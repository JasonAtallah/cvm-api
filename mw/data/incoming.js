const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');
const threads = require('../../lib/threads');

module.exports = {

  prepNewThreadState(req, res, next) {
    req.state = threads.transition(req.thread, req.action);
    next();
  },

  prepNewVendorFromBuyer(req, res, next) {
    req.vendor = req.body;

    ['flowers', 'edibles', 'concentrates'].forEach((key) => {
      if (!req.vendor[key]) {
        req.vendor[key] = {
          products: []
        };
      }
    });

    next();
  },

  prepNewVendorThread(req, res, next) {
    req.thread = {
      buyer: {
        _id: req.buyer._id,
        name: req.buyer.name
      },
      vendor: {
        _id: req.vendor._id,
        name: req.vendor.company.name
      },
      actions: [],
      states: [],
      state: threads.createState('NewVendor')
    };
    next();
  },

  prepNewVendorFromQuestionnaire(req, res, next) {
    req.vendor = req.body;
    next();
  },

  prepQuestionnaireResponseForUpdate(req, res, next) {
    req.response = req.body;
    req.response._id = new ObjectID(req.params.responseId);
    next();
  },

  prepRejectionEmail(req, res, next) {
    var message = '';
    message += `To: ${req.vendor.contact.email} \r\n`;
    message += `Subject: ${req.body.subject} \r\n`;
    message += `\r\n ${req.body.body}`;

    req.email = {
      accessToken: req.buyer.gAuth.accessToken,
      message: message
    };
    next();
  },

  prepRejectVendorAction(req, res, next) {
    req.action = {
      name: "RejectVendor",
      timestamp: new Date().getTime()
    };
    next();
  }

};
