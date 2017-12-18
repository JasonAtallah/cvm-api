const VendorRejectedState = require('./VendorRejected');

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
    }

    return this;
  }

};
