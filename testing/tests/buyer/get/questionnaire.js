const context = require('../../../lib/context');

describe('get questionnaire', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-questionnaire')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return the questionnaire', function () {
    const localEnv = {};

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],      
      'get-questionnaire'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'introduction', 'completion', 'pages');
      });
  });

});
