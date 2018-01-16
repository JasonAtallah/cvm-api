const context = require('../../../lib/context');

describe('get a vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {

    const localEnv = {
      VENDOR_ID: context.data.VENDOR_ID
    };

    return context.requests.run('get-vendor', { VENDOR_ID: localEnv.VENDOR_ID})
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return the vendor', function () {
    const localEnv = {
      vendor: context.data.vendor1,
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id'}],
      'get-vendor'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
      })
  });

});