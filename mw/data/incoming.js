const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');
const threads = require('../../lib/threads');

module.exports = {

  prepBuyerAction(req, res, next) {
    req.action = threads.createAction(req.params.action, req);
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

  prepThreadState(req, res, next) {
    const result = threads.transition(req.thread, req.action);
    req.state = result.newState;
    req.stateChanged = (result.newState !== result.oldState);
    next();
  },

  prepVendorAction(req, res, next) {
    req.action = threads.createAction(req.params.action, req);
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
  }

};
