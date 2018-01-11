const debug = require('debug')('cvm-api.mw.errors');
const config = require('../config');

module.exports = new class ErrorsMiddleware {

  status404(req, res, next) {
    if (!res._headerSent) {
      debug(`${req.path} not found`);
      res.status(404).send('File not found.');
    }
  }

  serverError(err, req, res, next) {
    let status;

    if (err.status) {
      status = err.status;
    } else if (err.statusCode) {
      status = err.statusCode;
    } else {
      status = 500;
    }

    if (status >= 500) {
      debug(`${status} error: ${err.message}`);
      debug(err);
    }

    if (!res._headerSent) {
      res.status(status).send(err.message);
    }
  }
};
