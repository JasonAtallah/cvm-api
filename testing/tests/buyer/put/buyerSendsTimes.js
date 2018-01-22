const context = require('../../../lib/context');

describe('buyer sends times', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-buyerSendsTimes', { VENDOR_ID: context.env.VENDOR_ID })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return 400 buyer has not been approved', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      vendorUrl: context.data.vendorUrl
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body.state).to.deep.include({ name: 'VendorNeedsToReviewTimes' });
      });
  });

  it('should return vendor with updated state', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      vendorUrl: context.data.vendorUrl
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'name', 'state');
        context.expect(response.body.state.suggestedTimes).to.not.be.null;
        context.expect(response.body.state).to.deep.include({ name: 'VendorNeedsToReviewTimes' });
        context.expect(response.body._id).to.equal(localEnv.VENDOR_ID);
        context.expect(response.body.name).to.equal(localEnv.vendor.company.name);
      });
  });
  
});
