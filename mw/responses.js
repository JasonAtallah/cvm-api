const _ = require('lodash');

module.exports = {
  
  send(status = 202 , msg = 'OK') {
    return (req, res, next) => {
      res.status(status).send({
        status: msg
      });
      next();
    };
  },

  sendReqVar(name, status = 200) {
    return (req, res, next) => {
      res.status(status).send(_.get(req, name));
      next();
    };
  },

  sendVar(data, status = 200) {
    return (req, res, next) => {
      res.status(status).send(data);
    };
  }

};
