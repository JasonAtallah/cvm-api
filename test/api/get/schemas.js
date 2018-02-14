const context = require('../../../testing/lib/context');

describe.only('get schemas', function () {

  it('should return 401 Unauthorized without token', function () {
    return context.requests.run('get-schemas')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return the schemas', function () {
    const localEnv = {};

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'get-schemas'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('array');
      });
  });

});
