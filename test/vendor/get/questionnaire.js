const context = require('../../../testing/lib/context');

describe('get questionnaire', function () {

  describe('invalid QID', function() {
    it('should return 404 qid not found', function() {
      const localEnv = {
        QID: '5a5e89c1fa4e933ba969c1ef'
      };

      const requestList = [
        'vendor-get-questionnaire'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(404);
        });
    });

    it('should return 400 invalid qid', function() {
      const localEnv = {
        QID: 'abc'
      };

      const requestList = [
        'vendor-get-questionnaire'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

  });

  it('should return the questionnaire', function () {
    const localEnv = {
      QID: context.env.QID
    };

    const requestList = [
      'vendor-get-questionnaire'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body._id).to.equal(localEnv.QID);
        context.expect(response.body.pages).to.be.an('array');
        context.expect(response.body).to.have.all.keys('_id', 'introduction', 'completion', 'pages');
      })
  });

});
