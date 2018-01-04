const Action = require('./Action');

module.exports = class ApproveVendorAction extends Action {

  constructor(req) {
    super();

    const mw = require('../../../mw');

    this.perform = mw.compose([
      mw.data.incoming.prepVendorApprovalEmail,
      mw.gmail.sendApprovalEmailToVendor
    ]);
  }
};
