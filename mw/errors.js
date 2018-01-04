const config = require('../config');

module.exports = new class ErrorsMiddleware {

  status404(req, res, next) {
    if (!res._headerSent) {
      console.log(req.path + ' not found');
      res.status(404).send('File not found.');
    }
  }

  serverError(err, req, res, next) {
    console.log('error: ' + err.message);
    console.dir(err);

    let status;

    if (err.status) {
      status = err.status;
    } else if (err.statusCode) {
      status = err.statusCode;
    } else {
      status = 500;
    }

    if (!res._headerSent) {
      res.status(status).send(err.message);
    }
  }
};
