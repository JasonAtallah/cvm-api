const State = require('./State');

module.exports = class VendorNeedsToReviewTimesState extends State {

  constructor(data) {
    super(data);
  }

  transition(action) {
    if (action.name === 'VendorChoosesTime') {
      const ApptScheduledState = require('./ApptScheduled');
      return new ApptScheduledState({
        startTime: action.data.selectedTime,
        rejectedTimes: this.data.rejectedTimes
      });
    } else if (action.name === 'VendorRejectsAllTimes') {
      const BuyerNeedsToSendTimesState = require('./BuyerNeedsToSendTimes');
      return new BuyerNeedsToSendTimesState({
        rejectedTimes: [...this.data.rejectedTimes, ...this.data.suggestedTimes]
      });
    }

    return this;
  }

};
