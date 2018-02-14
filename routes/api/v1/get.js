const express = require('express');
const config = require('../../../config');
const mw = require('../../../mw');

module.exports = function (app) {

  const router = express.Router();
  const schemasPath = config.app.dirs.schemas;
  const schemas = require(schemasPath);

  router.get('/schemas',
    mw.responses.sendVar(schemas));

  return router;
};
