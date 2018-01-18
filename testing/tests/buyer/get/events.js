const context = require('../../../lib/context');

describe('get events', function() {

  it('should return 401 Unauthorized without buyer token', function() {
    return context.requests.run('get-events')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);        
      });
  });

  it('should return all events on calendar', function() {
    this.timeout(10000);
    return context.requests.run('post-token')
      .then((response) => {        
        return context.requests.run('get-events', { BUYER_TOKEN: response.body })
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
          });
      });
  });

});