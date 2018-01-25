const context = require('../../../testing/lib/context');

describe('get vendors', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-vendors')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return all vendors', function () {
    const localEnv = {};

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'get-vendors'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('array');
        if (response.body.length > 0) {
          context.expect(response.body[0]).to.have.property('_id');
          context.expect(response.body[0]).to.have.property('name');
          context.expect(response.body[0]).to.have.property('state');
        }
      });
  });
  
});