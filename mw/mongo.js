const config = require('../config');

module.exports = {
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

  getVendors(req, res, next) {
    const query = {
      ownerId: req.user.id,
      vendorId: req.query.vendorId
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

  getEvents(req, res, next) {
    const query = {};

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

  rejectVendor(req, res, next) {
    const select = {
      ownerId: req.user.id,
      vendorId: req.body.vendorId
    };

    const update = {
      $set: {
        isRejected: true
      }
    };

    return config.mongo.getDB
      .then((db) => {
        db.collection('vendors').update(select, update)
          .then((result) => {
            req.result = result;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  updateCalendar(req, res, next) {
    const select = {
      id: req.user.sub || req.user.user_id || req.user.id
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
