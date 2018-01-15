const context = require('../../../lib/context');

describe('get questionnaire', function () {

  it('should return questionnaire', function () {
    return context.requests.run('get-questionnaire')
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.have.all.keys('_id', 'introduction', 'completion', 'pages');        
      });
  });
});