const context = require('../../../lib/context');

describe('get buyer', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-buyer')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return the buyer', function () {
    const localEnv = {
      vendor: context.data.vendor1,
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id'}],
      'get-buyer'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
      })
  });

});
