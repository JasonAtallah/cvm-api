const context = require('../../../lib/context');

describe('vendor cancels appt', function () {

  it('should return vendor with updated state', function () {
    let localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      selectedTime: context.data.suggestedTimes[0]
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes',
      'put-vendorChoosesTime',
      'put-vendorCancelsAppt'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes' });
      });
  });
  
});