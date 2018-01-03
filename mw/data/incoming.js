const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');
const threads = require('../../lib/threads');

module.exports = {

  prepApproveVendorAction(req, res, next) {
    req.action = {
      name: "ApproveVendor",
      timestamp: new Date().getTime()
    };
    next();
  },

  prepBuyerSentNewTimesAction(req, res, next) {
    console.log(req.body);
    req.action = {
      name: "BuyerSentNewTimes",
      timestamp: new Date().getTime(),
      suggestedTimes: req.body.timesSelected // needs to be converted to UTC
    };
    next();
  },

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

  prepVendorApprovalEmail(req, res, next) {
    var message = '';
    message += `To: ${req.vendor.contact.email} \r\n`;
    message += `Subject: ${req.body.subject} \r\n`;
    message += `\n${req.body.body}\n\nPlease Visit: ${req.body.scheduleUrl} to schedule a time to meet with the buyer.`;

    req.email = {
      accessToken: req.buyer.gAuth.accessToken,
      message: message
    };
    next();
  },

  prepVendorRejectionEmail(req, res, next) {
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
  },

  prepThreadAttribute(req, res, next) {
    if (req.params.attribute === 'watchVendor') {
      req.attribute = 'watchVendor';
      req.value = true;
    } else if (req.params.attribute === 'unwatchVendor') {
      req.attribute = 'watchVendor';
      req.value = false;
    }
    next();
  }

};
