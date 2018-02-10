const config = require('../../config');

module.exports = {

  getBuyers(req, res, next) {
    const buyerProjection = {
      buyer: 1,
      state: 1,
      attributes: 1
    };

    config.mongo.getDB
      .then((db) => {
        db.collection('threads').find(req.threadQuery).project(buyerProjection).toArray(function (err, buyers) {
          if (err) {
            next(err);
          } else {
            req.buyers = buyers;
            next();
          }
        });
      })
      .catch((err) => {
        next(err);
      });
  },

  getVendors(req, res, next) {
    const vendorProjection = {
      vendor: 1,
      state: 1,
      attributes: 1
    };

    config.mongo.getDB
      .then((db) => {
        db.collection('threads').find(req.threadQuery).project(vendorProjection).toArray(function (err, vendors) {
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

  insert(req, res, next) {
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

  update(req, res, next) {
    const select = {
      _id: req.thread._id
    };

    const update = {
      $push: {
        states: req.thread.state,
        actions: req.action.toObject()
      },
      $set: {
        state: req.state.toObject()
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
  },

  updateAttributes(req, res, next) {
    const select = {
      _id: req.thread._id
    };

    const update = req.attributeUpdate;

    const options = {
      returnOriginal: false,
      projection: {
        buyer: 1,
        vendor: 1,
        state: 1,
        attributes: 1
      }
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
  },

  updateOnAction(req, res, next) {
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
