const context = require('../../../lib/context');

describe('reject vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-vendorRejected', { VENDOR_ID: context.data.VENDOR_ID })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return vendor with updated state', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.rejectionEmail
    };
  
    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorRejected'
    ];
  
    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body.state).to.deep.include({ name: 'VendorRejected' });
        context.expect(response.body).to.deep.include({ name: context.data.vendor1.company.name });
      })
  });
  
});