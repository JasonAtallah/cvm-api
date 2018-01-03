const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');

module.exports = {

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

  insertThread(req, res, next) {
    config.mongo.getDB
      .then((db) => {
        return db.collection('threads').insert(req.thread)
          .then((result) => {
            req.thread = result.ops[0];
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  insertVendor(req, res, next) {
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

  updateVendorWatchStatusOnThread(req, res, next) {
    const select = {
      _id: req.thread._id
    };

    const update = {
      $set: {
        ['vendor.watch']: req.watchVendorStatus
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

  updateThreadOnAction(req, res, next) {
    const select = {
      _id: req.thread._id
    };

    const update = {
      $push: {
        states: req.thread.state,
        actions: req.action
      },
      $set: {
        state: req.state
      }
    };

    const options = {
      returnOriginal: false
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('threads').findOneAndUpdate(select, update, options)
          .then((result) => {
            req.thread = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  }

};
