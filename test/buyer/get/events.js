const context = require('../../../testing/lib/context');

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
            context.expect(response.body).to.be.an('array');
            if (response.body.length > 0) {
              context.expect(response.body[0]).to.have.property('id');
              context.expect(response.body[0]).to.have.property('status');
              context.expect(response.body[0]).to.have.property('htmlLink');
              context.expect(response.body[0]).to.have.property('created');
              context.expect(response.body[0]).to.have.property('updated');
              context.expect(response.body[0]).to.have.property('title');
              context.expect(response.body[0]).to.have.property('startDate');
              context.expect(response.body[0]).to.have.property('endDate');
            }
          });
      });
  });

});
