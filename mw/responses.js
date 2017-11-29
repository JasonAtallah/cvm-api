const _ = require('lodash');

module.exports = {
  sendReqVar(name) {
    return (req, res) => {
      res.status(200).send(_.get(req, name));
    };
  },

  sendOk(status = 202 , msg = 'OK') {
    return (req, res) => {
      res.status(status).send({
        status: msg
      });
    };
  }
};
