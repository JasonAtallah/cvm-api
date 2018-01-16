const context = require('../../../lib/context');

describe('stop watching vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-unwatchVendor', { VENDOR_ID: context.data.VENDOR_ID })
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return a 201 Ok', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.rejectionEmail
    };
  
    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-watchVendor',
      'put-unwatchVendor'
    ];
  
    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(201);
      })
  });

});