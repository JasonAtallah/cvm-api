const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');
const config = require('../config');

module.exports = {
  approveVendor(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.vendorId),
      buyerId: req.user.sub
    };

    const update = {
      $set: {
        status: 'approved'
      }
    };

    config.mongo.getDB
      .then((db) => {
        db.collection('vendors').findAndModify(select, [], update, { new: true })
          .then((result) => {
            req.vendor = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  cleanBuyer(req, res, next) {
    delete req.buyer._id;
    next();
  },

  createVendor(req, res, next) {
    const values = req.body;

    values.status = null;
    values.buyerId = req.user.sub;

    if (!values.company.name || !values.company.city) {
      res.status(400).send({
        error: 'name and city are required'
      });
      return;
    }

    config.mongo.getDB
      .then((db) => {
        return db.collection('vendors').insert(values)
          .then((result) => {
            req.vendor = result.ops[0];
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  extractQuestionnaire(req, res, next) {
    req.questionnaire = req.buyer.questionnaire;
    next();
  },

  getBuyer(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').findOne(req.buyerQuery)
          .then((buyer) => {
            if (buyer) {
              req.buyer = buyer;
              next();
            } else {
              let buyer = Object.assign({
                gcalendar: null
              }, req.buyerQuery);

              return db.collection('buyers').insert(buyer)
                .then((result) => {
                  req.buyer = buyer;
                  next();
                });
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  getResponse(req, res, next) {
    const query = {
      _id: new ObjectID(req.params.responseId)
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('vendors').findOne(query);
      })
      .then((response) => {
        if (response) {
          req.response = response;
          next();
        } else {
          const error = new Error('Response not found');
          error.status = 404;
          next(error);
        }
      })
      .catch((err) => {
        next(err);
      });
  },

  getVendors(req, res, next) {
    const query = {
      buyerId: req.user.sub
    };

    config.mongo.getDB
      .then((db) => {
        db.collection('vendors').find(query).toArray(function (err, vendors) {
          req.vendors = vendors;
          next();
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  mapQuestionnaireResponse(req, res, next) {
    req.response = _.omit(req.response, ['buyerId']);
    next();
  },

  prepBuyerQuery(type) {
    return (req, res, next) => {
      if (req.params.questionnaireId) {
        req.buyerQuery = {
          id: req.params.questionnaireId
        };
      } else {
        req.buyerQuery = {
          id: req.user.sub || req.user.user_id
        };
      }
      next();
    };
  },

  prepCreateQuestionnaireResponse(req, res, next) {
    req.response = Object.assign({}, req.body, {
      buyerId: req.params.buyerId
    });
    next();
  },

  prepUpdateQuestionnaireResponse(req, res, next) {
    req.response = _.omit(req.body, ['_id']);
    next();
  },

  rejectVendor(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.vendorId),
      buyerId: req.user.sub
    };

    const update = {
      $set: {
        status: 'rejected'
      }
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('vendors').findAndModify(select, [], update, { new: true })
          .then((result) => {
            req.vendor = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  saveQuestionnaireResponse(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('vendors').insert(req.response)
          .then((result) => {
            req.response = result.ops[0];
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  updateCalendar(req, res, next) {
    const select = {
      id: req.user.sub || req.user.user_id
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

  updateQuestionnaireResponse(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.responseId)
    };

    const update = req.response;

    config.mongo.getDB
      .then((db) => {
        return db.collection('vendors').update(select, update)
          .then((result) => {
            req.result = result;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  }
};
