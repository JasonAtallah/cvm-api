const _ = require('lodash');

module.exports = {

  sendReqVar(name, status = 200) {
    return (req, res, next) => {
      res.status(status).send(_.get(req, name));
      next();
    };
  },

  sendOk(status = 202 , msg = 'OK') {
    return (req, res, next) => {
      res.status(status).send({
        status: msg
      });
      next();
    };
  }
};
