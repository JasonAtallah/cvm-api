const context = require('../../../lib/context');

describe('get vendors', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-vendors')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return all vendors', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('get-vendors')
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
            context.expect(response.body).to.be.an('array');
          });
      });
  });

});