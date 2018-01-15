const context = require('../../../lib/context');

describe('Set calendar to new gCalendar', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-calendars-success')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return new calendar', function () {
    this.timeout(10000);
    return context.requests.run('post-token-success')
      .then((response) => {
        let token = response.body;
        return context.requests.run('put-calendars-success', { BUYER_TOKEN: token })
          .then((response) => {
            context.expect(response.statusCode).to.equal(202);
          });
      });
    })
      
  });