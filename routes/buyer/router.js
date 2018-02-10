const express = require('express');

module.exports = function (app) {

  const router = express.Router();

  router.use('/buyer/v1', require('./v1/del')(app));
  router.use('/buyer/v1', require('./v1/get')(app));
  router.use('/buyer/v1', require('./v1/post')(app));
  router.use('/buyer/v1', require('./v1/put')(app));

  return router;
};
