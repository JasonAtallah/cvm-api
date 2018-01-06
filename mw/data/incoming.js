const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');
const threads = require('../../lib/threads');

module.exports = {

  prepBuyerProfileUpdate(req, res, next) {
    req.buyerUpdate = {
      $set: {
        profile: req.body
      }
    };
    next();
  },

  prepCalendar(req, res, next) {
    req.calendar = req.body;
    next();
  },

  prepCalendarEventForInsert (req, res, next) {
    const timeParts = req.body.time.split(':');
    const startM = moment(req.body.date).set('hour', timeParts[0]).set('minute', timeParts[1]);
    req.event = {
      start: {
        dateTime: startM.toDate()
      },
      end: {
        dateTime: startM.add(req.body.duration, 'minutes').toDate()
      },
      summary: req.body.name,
      location: req.body.location
    };
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

  prepThreadAttribute(req, res, next) {
    if (req.params.attribute === 'watchVendor') {
      req.attribute = 'watchVendor';
      req.value = true;
    } else if (req.params.attribute === 'unwatchVendor') {
      req.attribute = 'watchVendor';
      req.value = false;
    }
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
