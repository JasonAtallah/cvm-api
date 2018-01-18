const context = require('../../../lib/context');

describe('get questionnaire', function () {

  it('should return the questionnaire', function () {
    const localEnv = {
      QID: context.data.QID
    };

    const requestList = [
      'get-questionnaire'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'introduction', 'completion', 'pages');        
      })
  });

});