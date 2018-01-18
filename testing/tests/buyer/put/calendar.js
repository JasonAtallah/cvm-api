const context = require('../../../lib/context');

describe('Set calendar to new gCalendar', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-calendar')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return new calendar', function () {
    this.timeout(10000);
    return context.requests.run('post-token')
      .then((response) => {        
        return context.requests.run('put-calendar', { BUYER_TOKEN: response.body, calendar: context.data.newCalendar })
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
            context.expect(response.body).to.be.an('object');
          });
      });
    })
      
  });