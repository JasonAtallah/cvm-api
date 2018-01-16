const context = require('../../../lib/context');

describe('create a new event', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-event', { event: context.data.event })
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return the new event', function () {
    const localEnv = {
      event: context.data.event
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'post-event'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.deep.include({
          status: 'confirmed',
          title: context.data.event.name
        });
      })
  });

  

});