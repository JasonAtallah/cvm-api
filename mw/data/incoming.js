const ObjectID = require('mongodb').ObjectID;
const { DateTime } = require('luxon');
const config = require('../../config');
const threads = require('../../lib/threads');
const validation = require('./validation');

module.exports = {

  prepBuyerProfileUpdate(req, res, next) {
    req.buyerUpdate = {
      $set: {
        'profile': req.body
      }
    };
    next();
  },

  prepCalendar(req, res, next) {
    req.calendar = req.body;
    next();
  },

  prepCalendarEventForInsert (req, res, next) {
    const startM = DateTime.fromJSDate(new Date(req.body.dateTime), {zone: req.body.timezone});
    req.event = {
      start: {
        dateTime: startM.toISO()
      },
      end: {
        dateTime: startM.plus({minutes: req.body.duration}).toISO()
      },
      summary: req.body.name,
      location: req.body.location
    };
    next();
  },

  prepNewBuyerLocation(req, res, next) {
    req.location = req.body;
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
        name: req.buyer.profile.company.name
      },
      vendor: {
        _id: req.vendor._id,
        name: req.vendor.company.name
      },
      actions: [],
      states: [],
      state: threads.createState('NewVendor').toObject()
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
    message += `Subject: ${req.body.email.subject} \r\n`;
    message += `\n${req.body.email.body}\n\nPlease Visit: ${req.body.email.scheduleUrl} to schedule a time to meet with the buyer.`;

    req.email = {
      accessToken: req.buyer.gAuth.accessToken,
      message: message
    };
    next();
  },

  prepVendorRejectionEmail(req, res, next) {
    var message = '';
    message += `To: ${req.vendor.contact.email} \r\n`;
    message += `Subject: ${req.body.email.subject} \r\n`;
    message += `\r\n ${req.body.email.body}`;

    req.email = {
      accessToken: req.buyer.gAuth.accessToken,
      message: message
    };
    next();
  }

};
