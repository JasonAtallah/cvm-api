const VendorRejectedState = require('./VendorRejected');
const VendorApprovedState = require('./VendorApproved');

module.exports = class NewVendorState {

  constructor(data) {
    this.data = data;
  }

  toObject() {
    return this.data;
  }

  transition(action) {
    if (action.name === 'RejectVendor') {
      return new VendorRejectedState();
    } else if (action.name === 'ApproveVendor') {
      return new VendorApprovedState();
    }

    return this;
  }

};
