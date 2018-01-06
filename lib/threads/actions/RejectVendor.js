const Action = require('./Action');

module.exports = class RejectVendorAction extends Action {

  constructor(req) {
    super();
    this.data.email = req.body.email;
  }

};
