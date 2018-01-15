const context = require('../../../lib/context');

describe('stop watching vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-unwatchVendor')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return a 201 Ok', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('put-unwatchVendor')
          .then((response) => {
            context.expect(response.statusCode).to.equal(201);
          });
      });
  });

});