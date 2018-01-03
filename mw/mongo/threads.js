const config = require('../../config');

module.exports = {

  updateThreadAttribute(req, res, next) {
    console.log(req.params);
    const select = {
      _id: req.thread._id
    };

    const update = {
      $set: {
        [`attributes.${req.attribute}`]: req.value
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