const context = require('../../../lib/context');

describe('vendor chooses time', function () {

  it('should return 400 selectedTime not in suggestedTimes', function () {
    let localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      selectedTime: context.data.badSelectedTime
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes',
      'put-vendorChoosesTime'
    ];

    return context.requests.runAll(requestList, localEnv)
      .catch((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
  });

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
      'put-vendorChoosesTime'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body.state).to.deep.include({ name: 'ApptScheduled' });
        context.expect(response.body.state.selectedTime).to.deep.equal(localEnv.selectedTime);
      });
  });

});
