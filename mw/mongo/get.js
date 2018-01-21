const config = require('../../config');

module.exports = {

  buyer(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').findOne(req.buyerQuery)
          .then((buyer) => {
            if (buyer) {
              req.buyer = buyer;
              next();
            } else {
              const err = new Error('Buyer not found.');
              err.status = 404;
              next(err);
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  questionnaire(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('questionnaires').findOne(req.questionnaireQuery)
          .then((questionnaire) => {
            if (questionnaire) {
              req.questionnaire = questionnaire;
              next();
            } else {
              const err = new Error('Questionnaire not found.');
              err.status = 404;
              next(err);
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  thread(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        db.collection('threads').findOne(req.threadQuery)
          .then((thread) => {
            if (!thread) {
              const err = new Error('Thread not found');
              err.status = 404;
              next(err);
            } else {
              req.thread = thread;
              next();
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  vendor(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        db.collection('vendors').findOne(req.vendorQuery)
          .then((vendor) => {
            if (!vendor) {
              const err = new Error('Vendor not found');
              err.status = 404;
              next(err);
            } else {
              req.vendor = vendor;
              next();
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  }
};
