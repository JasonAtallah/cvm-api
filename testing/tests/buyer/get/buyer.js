const context = require('../../../lib/context');

describe('get buyer', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-buyer')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return the buyer', function () {
    const localEnv = {};

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],      
      'get-buyer'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {        
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.property('_id');
        context.expect(response.body).to.have.property('emails');
        context.expect(response.body).to.have.property('gcalendar');
        context.expect(response.body).to.have.property('gProfile');
        context.expect(response.body).to.have.property('profile');
        context.expect(response.body).to.have.property('schedule');
        context.expect(response.body).to.have.property('firstName');
        context.expect(response.body).to.have.property('locations');
      });
  });

});
