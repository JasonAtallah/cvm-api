const context = require('../../../testing/lib/context');

describe('get buyer token', function() {

  it('should return 400 on bad buyerId', function() {
    return context.requests.run('post-token', { BUYER_ID: null })
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
  });

  it('should return a 404 buyer not found', function() {
    return context.requests.run('post-token', { BUYER_ID: '5a5e89c1fa3e933ba969c1ef' })
      .then((response) => {
        context.expect(response.statusCode).to.equal(404);
      });
  });

  it('should return jwt token', function() {
    return context.requests.run('post-token')
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.match(/^[\w\W]{100,}$/);
      });
  });

});

