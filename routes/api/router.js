const express = require('express');

module.exports = function (app) {

  const router = express.Router();

  router.use('/api/v1', require('./v1/get')(app));

  return router;
};
