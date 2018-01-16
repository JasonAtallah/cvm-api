const context = require('../../../lib/context');

describe('get calendars', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-calendars')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return all calendars', function () {
    const localEnv = {};

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'get-calendars'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
      })
  });


});