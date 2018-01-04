const Action = require('./Action');

module.exports = class RejectVendorAction extends Action {

  constructor(req) {
    super();

    const mw = require('../../../mw');
    
    this.perform = mw.compose([
      mw.data.incoming.prepVendorRejectionEmail,
      mw.gmail.sendRejectionEmailToVendor
    ]);
  }

};
