const context = require('../../../lib/context');

describe('get questionnaire', function () {

  describe('invalid QID', function() {
    it('should return 400 missing qid', function() {
      const localEnv = {
        QID: null
      };

      const requestList = [
        'get-questionnaire'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 404 empty qid not found', function() {
      const localEnv = {
        QID: ''
      };

      const requestList = [
        'get-questionnaire'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(404);
        });
    });

  });

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