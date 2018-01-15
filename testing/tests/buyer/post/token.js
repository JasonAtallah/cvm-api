const context = require('../../../lib/context');

describe('get buyer token', function() {
  it('should return jwt token', function() {
    return context.requests.run('post-token-success')
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.match(/^[\w\W]{100,}$/);
      })
  });

  it('should return 400 on bad buyerId', function() {
    return context.requests.run('post-token-success', { BUYER_ID: null })
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      })
  });

});

