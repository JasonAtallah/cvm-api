const context = require('../../../testing/lib/context');

describe('update questionnaire', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-questionnaire')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return a 200 with the new questionnaire', function() {

    const localEnv = {
      questionnaire: context.data.questionnaire
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'put-questionnaire'
    ]

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'introduction', 'completion', 'pages');
      });
  });

});
