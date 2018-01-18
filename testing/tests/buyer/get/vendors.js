const context = require('../../../lib/context');

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
      })

  });
  
});