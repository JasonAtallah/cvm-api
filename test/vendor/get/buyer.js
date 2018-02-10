const context = require('../../../testing/lib/context');

describe('vendor', function () {

  describe('get buyer', function () {

    it('should return the buyer', function () {
      const localEnv = {
        vendor: context.data.vendor1
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id'}],
        'vendor-get-buyer'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(200);
          context.expect(response.body).to.be.an('object');
          context.expect(response.body).to.have.all.keys('_id', 'state', 'name');
        });
    });

  });

});
