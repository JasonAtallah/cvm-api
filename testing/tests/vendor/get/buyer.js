const context = require('../../../lib/context');

describe('get buyer', function () {

  it('should return buyer', function () {
    return context.requests.run('get-buyer')
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.have.property('_id');
        context.expect(response.body).to.have.property('name');
        context.expect(response.body).to.have.property('state');
      });
  });
});