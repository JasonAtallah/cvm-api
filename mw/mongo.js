const ObjectID = require('mongodb').ObjectID;
const config = require('../config');

module.exports = {
  approveVendor(req, res, next) {
    console.dir(req.params);
    const select = {
      _id: new ObjectID(req.params.vendorId),
      ownerId: req.user.sub
    };
    console.dir(select);
    const update = {
      $set: {
        status: 'approved'
      }
    };

    return config.mongo.getDB
      .then((db) => {
        db.collection('vendors').findAndModify(select, [], update, { new: true })
          .then((result) => {
            console.dir(result);
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

  getBuyer(req, res, next) {
    const query = {
      id: req.user.sub
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

  getEvents(req, res, next) {
    const query = {
      ownerId: req.user.sub
    };

    return config.mongo.getDB
      .then((db) => {
        db.collection('events').find(query).toArray(function (err, events) {
          req.events = events;
          next();
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
      id: req.user.sub
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
