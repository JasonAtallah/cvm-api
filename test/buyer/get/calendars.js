const context = require('../../../testing/lib/context');

describe('get calendars', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-calendars')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return array of calendars in expected format', function () {
    this.timeout(10000);
    
    const localEnv = {};

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'get-calendars'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200, response.body);
        context.expect(response.body).to.be.an('array');
        if (response.body.length > 0) {
          context.expect(response.body[0]).to.have.property('type');
          context.expect(response.body[0]).to.have.property('id');
          context.expect(response.body[0]).to.have.property('name');
          context.expect(response.body[0]).to.have.property('timezone');
        }
      });
  });

});
