const State = require('./State');

module.exports = class NewVendorState extends State {

  constructor(data) {
    super(data);
  }

  transition(action) {
    if (action.name === 'RejectVendor') {
      const VendorRejectedState = require('./VendorRejected');
      return new VendorRejectedState();
    } else if (action.name === 'ApproveVendor') {
      const BuyerNeedsToSendTimesState = require('./BuyerNeedsToSendTimes');
      return new BuyerNeedsToSendTimesState();
    }

    return this;
  }

};
