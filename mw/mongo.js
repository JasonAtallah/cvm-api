const ObjectID = require('mongodb').ObjectID;
const config = require('../config');

module.exports = {
  approveVendor(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.vendorId),
      ownerId: req.user.sub
    };

    const update = {
      $set: {
        status: 'approved'
      }
    };

    return config.mongo.getDB
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

    values.products = [];
    values.status = null;
    values.ownerId = req.user.sub;

    if (!values.name || !values.city) {
      res.status(400).send({
        error: 'name and city are required'
      });
      return;
    }

    return config.mongo.getDB
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

  getBuyer(req, res, next) {
    const query = {
      id: req.user.sub || req.user.user_id
    };

    return config.mongo.getDB
      .then((db) => {
        db.collection('buyers').findOne(query)
          .then((buyer) => {
            if (buyer) {
              req.buyer = buyer;
              next();
            }else {
              let buyer = {
                id: query.id,
                gcalendar: null
              };

              db.collection('buyers').insert(buyer)
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

  getVendors(req, res, next) {
    const query = {
      ownerId: req.user.sub
    };

    return config.mongo.getDB
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

  rejectVendor(req, res, next) {
    const select = {
      _id: new ObjectID(req.params.vendorId),
      ownerId: req.user.sub
    };

    const update = {
      $set: {
        status: 'rejected'
      }
    };

    return config.mongo.getDB
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

  updateCalendar(req, res, next) {
    const select = {
      id: req.user.sub || req.user.user_id
    };

    const update = {
      $set: {
        gcalendar: req.calendar
      }
    };

    return config.mongo.getDB
      .then((db) => {
        db.collection('buyers').update(select, update)
          .then((result) => {
            req.result = result;
            next();
          })
          .catch((err) => {
            next(err);
          });
      })
      .catch((err) => {
        next(err);
      });
  }
};
