const State = require('./State');

module.exports = class BuyerNeedsToSendTimesState extends State {

  constructor(data) {
    super(data);
    this.data.rejectedTimes = this.data.rejectedTimes || [];
  }

  transition(action) {
    if (action.name === 'BuyerSendsTimes') {
      const VendorNeedsToReviewTimesState = require('./VendorNeedsToReviewTimes');
      return new VendorNeedsToReviewTimesState({
        suggestedTimes: action.data.suggestedTimes,
        rejectedTimes: this.data.rejectedTimes
      });
    }

    return this;
  }

};
