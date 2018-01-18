const context = require('../../../lib/context');

describe('buyer cancels appt', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-buyerCancelsAppt', { VENDOR_ID: context.data.VENDOR_ID })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return vendor with updated state', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      selectedTime: context.data.suggestedTimes[0],
      event: context.data.event
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes',
      'put-vendorChoosesTime',
      'put-buyerCancelsAppt'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes' });
      })

  });
  
});
