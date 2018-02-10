const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();

  if (config.env === 'testing') {
    router.delete('/vendors',
      mw.mongo.vendors.deleteAll);
  }

  return router;
};
