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

  update(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').update(req.buyerUpdate.query, req.buyerUpdate.update)
          .then((result) => {
            req.result = result;
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

    const options = {
      returnOriginal: false
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').findOneAndUpdate(select, update, options)
          .then((result) => {
            req.emails = result.value.emails;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

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

  updateLoggedInBuyer(req, res, next) {
    const select = {
      _id: new ObjectID(req.userId)
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').update(select, req.buyerUpdate)
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
  }

}
