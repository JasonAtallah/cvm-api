const State = require('./State');

module.exports = class ApptScheduledState extends State {

  constructor(data) {
    super(data);
  }

  transition(action) {
    if (action.name === 'BuyerCancelsAppt') {
      const BuyerNeedsToSendTimesState = require('./BuyerNeedsToSendTimes');
      return new BuyerNeedsToSendTimesState({
        rejectedTimes: [...this.data.rejectedTimes, this.data.startTime]
      });
    } else if (action.name === 'VendorCancelsAppt') {
      const BuyerNeedsToSendTimesState = require('./BuyerNeedsToSendTimes');
      return new BuyerNeedsToSendTimesState({
        rejectedTimes: [...this.data.rejectedTimes, this.data.startTime]
      });
    }

    return this;
  }

};
