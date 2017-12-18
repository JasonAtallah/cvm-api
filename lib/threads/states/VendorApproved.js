
module.exports = class VendorApprovedState {

  constructor(data) {
    this.data = data || {
      name: 'VendorApproved'
    };
  }

  toObject() {
    return this.data;
  }

  transition(action) {
    return this;
  }

};
