const context = require('../../../testing/lib/context');

// vendor-flowers 'number' types changes to strings
describe('submit questionnaire response', function () {

  it('should return response and vendorId', function () {

    localEnv = {
      QID: context.env.QID,
      questionnaireResponse: context.data.questionnaireResponse
    };

    requestList = [
      'post-questionnaireResponse'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('company', 'contact', 'flowers', 'edibles', 'concentrates', '_id');
        context.expect(response.body).to.deep.include({
          company: {
            name: localEnv.questionnaireResponse.company.name,
            city: localEnv.questionnaireResponse.company.city
          },
          contact: {
            firstName: localEnv.questionnaireResponse.contact.firstName,
            email: localEnv.questionnaireResponse.contact.email
          }
        });
      });
  });
});
