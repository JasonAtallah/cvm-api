const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');

module.exports = {

  initialize(req, res, next) {
    const select = {
      'gProfile.id': req.gProfile.id
    };

    const update = {
      $set: {
        emails: {
          approveVendor: {
            subject: 'Congrats',
            body: 'Schedule an appointment'
          },
          rejectVendor: {
            subject: 'Sorry',
            body: 'Not interested'
          },
          newVendor: {
            subject: 'New vendor applied',
            body: 'Check CVM'
          }
        },
        gcalendar: null,
        schedule: []
      }
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').findOneAndUpdate(select, update)
          .then((result) => {
            req.buyer = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  updateEmailTemplate(req, res, next) {
    const select = {
      _id: new ObjectID(req.userId)
    };

    var update = {
      $set: {
        [`emails.${req.params.templateId}`]: {
          subject: req.body.subject,
          body: req.body.body
        }
      }
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').update(select, update)
          .then((result) => {
            req.result = result;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  /**
  Input: req.user, req.calendar
  Output: req.result
  **/
  updateCalendar(req, res, next) {
    const select = {
      _id: new ObjectID(req.userId)
    };

    const update = {
      $set: {
        gcalendar: req.calendar
      }
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').update(select, update)
          .then((result) => {
            req.result = result;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  updateSchedule(req, res, next) {
    const select = {
      id: req.userId
    };

    var update = {
      $set: {
        schedule: req.body
      }
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').update(select, update)
          .then((result) => {
            req.result = result;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  unwatchVendor(req, res, next) {
    const select = {
      _id: req.thread._id
    };

    const update = {
      $set: {
        ['buyer.watchVendor']: false
      }
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('threads').findOneAndUpdate(select, update)
          .then((result) => {
            req.thread = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  watchVendor(req, res, next) {
    const select = {
      _id: req.thread._id
    };

    const update = {
      $set: {
        ['buyer.watchVendor']: true
      }
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('threads').findOneAndUpdate(select, update)
          .then((result) => {
            req.thread = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  }

}
