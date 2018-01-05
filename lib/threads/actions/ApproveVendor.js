const Action = require('./Action');

module.exports = class ApproveVendorAction extends Action {

  constructor(req) {
    super();
    this.data.email = req.body.email;

    const mw = require('../../../mw');

    this.perform = mw.compose([
      mw.data.incoming.prepVendorApprovalEmail,
      mw.gmail.sendApprovalEmailToVendor
    ]);
  }
};
