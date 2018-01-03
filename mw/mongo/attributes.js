const config = require('../../config');

module.exports = {

  updateVendorWatchStatusOnThread(req, res, next) {
    const select = {
      _id: req.thread._id
    };

    const update = {
      $set: {
        'attributes.watchVendor': req.watchVendorStatus
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
  }
};