const context = require('../../../lib/context');

describe('approve vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-vendorApproved', { VENDOR_ID: context.data.VENDOR_ID })
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return vendor with updated state', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail
    };
  
    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved'
    ];
  
    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes' });
        context.expect(response.body).to.deep.include({ name: context.data.vendor1.company.name });
      })
  });
  
});

