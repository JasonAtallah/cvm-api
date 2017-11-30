const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash');
const config = require('../config');

module.exports = {

  /**
  Inputs: req.params.vendorId, req.buyer
  Outputs: req.vendor
  **/
  approveVendor(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.vendorId),
      buyerId: req.buyer._id
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

  createBuyer(req, res, next) {
    const buyer = Object.assign({
      gcalendar: null,
      email: req.gProfile.email
    }, req.buyerQuery);

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').insert(buyer)
          .then((result) => {
            req.buyer = buyer;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  createVendor(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('vendors').insert(req.vendor)
          .then((result) => {
            req.vendor = result.ops[0];
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  /**
  Get buyer record

  Input: req.buyerQuery
  Output: req.buyer
  **/
  getBuyer(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').findOne(req.buyerQuery)
          .then((buyer) => {
            if (buyer) {
              req.buyer = buyer;
              next();
            } else {
              next();
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  getQuestionnaire(req, res, next) {
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

  getVendors(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        db.collection('vendors').find(req.vendorQuery).toArray(function (err, vendors) {
          if (err) {
            next(err);
          } else {
            req.vendors = vendors;
            next();
          }
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  prepBuyerQueryFromAuth(req, res, next) {
    req.buyerQuery = {
      id: req.userId
    };
    next();
  },

  prepBuyerQueryFromQuestionnaire(req, res, next) {
    req.buyerQuery = {
      _id: new ObjectID(req.questionnaire.buyerId)
    };
    next();
  },

  prepQuestionnaireForResponse(req, res, next) {
    req.questionnaire = _.omit(req.questionnaire, ['buyerId']);
    next();
  },

  prepVendorForResponse(req, res, next) {
    req.vendor = _.omit(req.vendor, ['buyerId']);
    next();
  },

  /**
  Inputs: req.body, req.buyer
  Outputs: req.vendor
  **/
  prepNewVendorFromBuyer(req, res, next) {
    if (!req.body.company.name || !req.body.company.city) {
      const err = new Error('name and city are required');
      err.status = 400;
      next(err);
    } else {
      req.vendor = req.body;
      req.vendor.buyerId = req.buyer._id;
      req.vendor.status = null;

      ['flowers', 'edibles', 'concentrates'].forEach((key) => {
        if (!req.vendor[key]) {
          req.vendor[key] = {
            products: []
          };
        }
      });

      next();
    }
  },

  /**
  Inputs: req.body, req.questionnaire
  Outputs: req.vendor
  **/
  prepNewVendorFromQuestionnaire(req, res, next) {
    if (!req.body.company.name || !req.body.company.city) {
      const err = new Error('name and city are required');
      err.status = 400;
      next(err);
    } else {
      req.vendor = req.body;
      req.vendor.buyerId = req.questionnaire.buyerId;
      req.vendor.status = null;
      next();
    }
  },

  /**
  Inputs: req.body
  Outputs: req.response
  **/
  prepQuestionnaireResponseForUpdate(req, res, next) {
    req.response = req.body;
    req.response._id = new ObjectID(req.params.responseId);
    next();
  },

  prepQuestionnaireQueryById(req, res, next) {
    req.questionnaireQuery = {
      _id: new ObjectID(req.params.questionnaireId)
    };
    next();
  },

  prepVendorOnQuestionnaire(req, res, next) {
    if (!req.vendor.questionnaires) {
      req.vendor.questionnaires = {};
    }

    req.vendor.questionnaires[req.params.questionnaireId] = req.body;
    next();
  },

  // prepVendorQuery(req, res, next) {
  //   req.vendor
  // },

  /**
  Inputs: req.buyer
  Outputs: req.vendorQuery
  **/
  prepVendorQueryFromBuyer(req, res, next) {
    req.vendorQuery = {
      buyerId: req.buyer._id
    };
    next();
  },

  rejectVendor(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.vendorId),
      buyerId: req.buyer._id
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

  updateBuyerEmailTemplate(req, res, next) {
    const select = {
      id: req.user.sub
    };
    console.log(req.email.status);
    if (req.email.status === 'reject') {
      var update = {
        $set: {
          emails: {
            rejectVendor: {
              subject: req.email.subject,
              body: req.email.body
            }
          }
        }
      };
    }
    else if (req.email.status === 'approve') {
      var update = {
        $set: {
          emails: {
            approveVendor: {
              subject: req.email.subject,
              body: req.email.body
            }
          }
        }
      };
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
      id: req.user.sub
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
      _id: req.response._id
    };

    const setValues = {};

    Object.keys(req.response)
      .filter((key) => {
        return key !== '_id';
      })
      .forEach((key) => {
        setValues[key] = req.response[key];
      });

    const update = {
      $set: setValues
    };

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
  },

  updateVendor(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.vendorId)
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
