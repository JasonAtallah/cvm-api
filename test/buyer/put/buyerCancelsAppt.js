const context = require('../../../testing/lib/context');

describe('buyer cancels appt', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-buyerCancelsAppt', { VENDOR_ID: context.env.VENDOR_ID })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return 400 vendor has not chosen time', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      vendorUrl: context.data.vendorUrl,
      selectedTime: context.data.suggestedTimes[0],
      event: context.data.event
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes',
      'put-buyerCancelsAppt'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
  });

  it('should return vendor with updated state', function () {
    this.timeout(10000);

    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      vendorUrl: context.data.vendorUrl,
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
        context.expect(response.body).to.have.all.keys('_id', 'name', 'state');
        context.expect(response.body.state.rejectedTimes).to.not.be.null;
        context.expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes' });
        context.expect(response.body._id).to.equal(localEnv.VENDOR_ID);
        context.expect(response.body.name).to.equal(localEnv.vendor.company.name);
      });
  });

});
