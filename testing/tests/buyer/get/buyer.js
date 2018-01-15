const context = require('../../../lib/context');

describe('get buyer', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-buyer')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return buyer', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('get-buyer')
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
          });
      });
  });

});