module.exports = {
  sendReqVar(name) {
    return (req, res) => {
      res.status(200).send(req[name]);
    };
  },

  sendOk(msg = 'OK') {
    return (req, res) => {
      res.status(202).send({
        status: msg
      });
    };
  }
};
