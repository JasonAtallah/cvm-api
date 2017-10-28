const express = require('express');
const jwtAuthz = require('express-jwt-authz');
const config = require('../../config');

module.exports = function(app) {

  const router = express.Router();
  const isBuyer = jwtAuthz(['buyer']);

  router.get('/vendors', /*isBuyer,*/ function(req, res) {
    config.mongo.getDB.then(function(db) {
      db.collection('vendors').find({}).toArray(function(err, vendors) {
        res.status(200).send(vendors);
      });
    });
  });

  router.get('/events', /*isBuyer,*/ function(req, res) {
    config.mongo.getDB.then(function(db) {
      db.collection('events').find({}).toArray(function(err, events) {
        res.status(200).send(events);
      });
    });
  });

  app.use('/api', router);
}
