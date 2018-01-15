const context = require('../../../lib/context');

describe('get a vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-vendor')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return a vendors', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('post-vendor', { vendor: context.env.vendor1 })
          .then((response) => {
            context.env.VENDOR_ID = response.body._id;
            return context.requests.run('get-vendors')
              .then((response) => {
                context.expect(response.statusCode).to.equal(200);
                context.expect(response.body).to.be.an('array');
              });
          });
      });
  });

});