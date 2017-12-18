const express = require('express');

module.exports = function (app) {

  const router = express.Router();

  router.use('/vendor/v1', require('./v1/all')(app));

  return router;
};
