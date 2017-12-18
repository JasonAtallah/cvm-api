
module.exports = class VendorRejectedState {

  constructor(data) {
    this.data = data || {
      name: 'VendorRejected'
    };
  }

  toObject() {
    return this.data;
  }

  transition(action) {
    return this;
  }

};
