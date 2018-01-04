const express = require('express');

module.exports = function (app) {

  const router = express.Router();

  router.use('/buyer/v1', require('./v1/get')(app));
  router.use('/buyer/v1', require('./v1/put')(app));
  router.use('/buyer/v1', require('./v1/post')(app));

  return router;
};
