const context = require('../../../lib/context');

describe('create a new event', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-event')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return the new event', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('post-event', { event: context.env.event })
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
            context.expect(response.body).to.deep.include({ 
              status: 'confirmed',
              title: context.env.event.name
            });
          });
      });
  });

});