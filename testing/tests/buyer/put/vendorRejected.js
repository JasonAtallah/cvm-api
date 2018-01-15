const context = require('../../../lib/context');

describe('reject vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-vendorRejected-success', { vendor: context.env.vendor1 })
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return vendor with updated state', function () {
    return context.requests.run('post-token-success')
      .then((response) => {
        let token = response.body
        return context.requests.run('post-vendor-success', { BUYER_TOKEN: token, vendor: context.env.vendor1 })
          .then((response) => {
            const vendorId = response.body._id;
            return context.requests.run('put-vendorRejected-success', { BUYER_TOKEN: token, VENDOR_ID: vendorId, email: context.env.rejectionEmail })
              .then((response) => {
                context.expect(response.statusCode).to.equal(200);
                context.expect(response.body.state).to.deep.include({ name: 'VendorRejected' });
              });
          });
      });
  });
  
});