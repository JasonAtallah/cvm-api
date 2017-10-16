const express = require('express');
const jwtAuthz = require('express-jwt-authz');
const config = require('../../config');

module.exports = function(app) {

  const router = express.Router();
  const checkVendorScope = jwtAuthz([]);

  router.get('/vendors', checkVendorScope, function(req, res) {
    config.mongo.getDB.then(function(db) {
      db.collection('vendors').find({}).toArray(function(err, vendors) {
        res.status(200).send(vendors);
      });
    });
  });

  router.post('/vendors/:vendorId/reject', checkVendorScope, function(req, res) {

  });

  app.use('/api', router);
}
