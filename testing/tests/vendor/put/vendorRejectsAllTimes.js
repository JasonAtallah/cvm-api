const context = require('../../../lib/context');

describe('vendor rejects all times', function () {

  it('should return vendor with updated state', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      selectedTime: context.data.suggestedTimes[0]
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      ['put-buyerSendsTimes', {'suggestedTimes': 'body.state.suggestedTimes'}],
      'put-vendorRejectsAllTimes'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body._id).to.equal(localEnv.VENDOR_ID)
        context.expect(response.body.name).to.equal(localEnv.vendor.company.name)
        context.expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes' });
        context.expect(response.body.state.rejectedTimes).to.not.be.null;
        context.expect(response.body.state.rejectedTimes).to.deep.equal(localEnv.suggestedTimes);
      })

  });
  
});