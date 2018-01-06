const mw = require('../../../mw');

module.exports = mw.compose([
  mw.data.incoming.prepVendorApprovalEmail,
  mw.gmail.sendApprovalEmailToVendor
]);
