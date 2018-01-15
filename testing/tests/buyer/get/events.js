const context = require('../../../lib/context');

describe('get events', function() {

  it('should return 401 Unauthorized without buyer token', function() {
    return context.requests.run('get-events-success')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);        
      });
  });

  it('should return all events on calendar', function() {
    this.timeout(10000);
    return context.requests.run('post-token-success')
      .then((response) => {
        let token = response.body;
        return context.requests.run('get-events-success', { BUYER_TOKEN: token })
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
          });
      });
  });

});