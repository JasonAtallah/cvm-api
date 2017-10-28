const config = require('../config');
const api = require('./api');

module.exports = function(app) {

  api(app);

  app.use(function(req, res, next) {
    const err = new Error('Not Found: ' + req.originalUrl);
    err.status = 404;
    next(err);
  });
}
