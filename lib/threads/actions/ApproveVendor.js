const Action = require('./Action');

module.exports = class ApproveVendorAction extends Action {

  constructor(req) {
    super();
    this.data.email = req.body.email;
    this.data.scheduleUrl = req.body.scheduleUrl;
  }
};
