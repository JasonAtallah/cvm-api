const context = require('../../../lib/context');

describe('update buyer profile', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-profile')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return a 204 No Content', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('put-profile', { profile: context.data.profile })
          .then((response) => {
            context.expect(response.statusCode).to.equal(204);           
          });
      });
  });

});