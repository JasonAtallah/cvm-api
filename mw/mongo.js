const ObjectID = require('mongodb').ObjectID;
const GridFSBucket = require('mongodb').GridFSBucket;
const _ = require('lodash');
const traverse = require('traverse');
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

  createClientCode(req, res, next) {
    const record = {
      token: req.clientJWT,
      code: Math.random().toString().slice(2)
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('clientCodes').insert(record)
          .then((result) => {
            req.clientCode = record.code;
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

  getTokenForCode(req, res, next) {
    const query = {
      code: req.query.code
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('clientCodes').findOneAndDelete(query)
          .then((result) => {
            if (result) {
              req.token = result.value.token;
              next();
            } else {
              const err = new Error('Invalid code');
              err.status = 400;
              next(err);
            }
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  getVendor(req, res, next) {
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

  initializeBuyer(req, res, next) {
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

  /*
  Inputs: req.vendor, req.params.fileId
  Outputs: req.file
  */
  locateFileInVendor(req, res, next) {
    traverse(req.vendor).forEach(function (elem) {
      if (elem && elem.id === req.params.fileId) {
        req.file = elem;
      }
    });
    next();
  },

  lookupLoginCallback(req, res, next) {
    const query = {
      _id: new ObjectID(req.query.state)
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('logins').findOneAndDelete(query)
          .then((result) => {
            req.loginCallback = result.value.callback;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  prepBuyerForResponse(req, res, next) {
    req.buyer = Object.assign(_.pick(req.buyer, ['_id', 'emails', 'gcalendar', 'schedule']), {
      firstName: req.buyer.gProfile.firstName
    });
    next();
  },

  prepBuyerQueryFromAuth(req, res, next) {
    req.buyerQuery = {
      _id: new ObjectID(req.userId)
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
  },

  /**
  Inputs: req.body, req.questionnaire
  Outputs: req.vendor
  **/
  prepNewVendorFromQuestionnaire(req, res, next) {
    req.vendor = req.body;
    req.vendor.buyerId = req.questionnaire.buyerId;
    req.vendor.status = null;
    next();
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

  prepBuyersVendorQueryFromUrl(req, res, next) {
    req.vendorQuery = {
      _id: new ObjectID(req.params.vendorId),
      buyerId: new ObjectID(req.userId)
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

  saveLoginCallback(req, res, next) {
    const record = {
      callback: req.query.callback
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('logins').insert(record)
          .then((result) => {
            req.loginCallback = result.ops[0];
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  sendFile(req, res, next) {
    res.set('Content-Type', req.file.contentType);
    res.set('Content-Disposition', `attachment; filename="${req.file.filename}"`);

    config.mongo.getDB
    .then((db) => {
      var bucket = new GridFSBucket(db,
        { bucketName: req.file.bucketName, chunkSizeBytes: req.file.chunkSize });
      var downloadStream = bucket.openDownloadStream(req.file.id);        
      downloadStream.on("error", function(err) { 
        next(err);
      });
      downloadStream.pipe(res);  
    })
    .catch((err) => {
      next(err);
    });        
  },

  updateBuyerEmailTemplate(req, res, next) {
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

  updateBuyerSchedule(req, res, next) {
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

  /**
  Inputs: req.gAuth, req.gProfile
  **/
  updateGoogleAuthAndProfileForBuyer(req, res, next) {
    const select = {
      'gProfile.id': req.gProfile.id
    };

    const update = {
      $set: {
        gProfile: req.gProfile,
        'gAuth.accessToken': req.gAuth.access_token,
        'gAuth.refreshToken': req.gAuth.refresh_token,
        'gAuth.tokenType': req.gAuth.token_type,
        'gAuth.expiryDate': req.gAuth.expiry_date
      }
    };

    const options = {
      upsert: true
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('buyers').findOneAndUpdate(select, update, options)
          .then((result) => {
            req.buyer = result.value;
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
  },

  validateNewVendor(req, res, next) {
    let err;

    if (!req.body.company.name) {
      err = new Error('Company name is required');
    } else if (!req.body.company.city) {
      err = new Error('Company city is required');
    } else if (!req.body.contact.email) {
      err = new Error('Contact email is required');
    }

    if (err) {
      err.status = 400;
      next(err);
    } else {
      next();
    }
  }
};
