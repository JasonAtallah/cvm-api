const config = require('../../config');

module.exports = {

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

  updateAttribute(req, res, next) {
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
