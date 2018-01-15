const context = require('../../../lib/context');

describe('get calendars', function () {

  it('should return 400 Unauthorized without buyer token', function () {
    return context.requests.run('get-calendars')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(400);
      });
  });

  it('should return all calendars', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('get-calendars')
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
          });
      });
  });

});