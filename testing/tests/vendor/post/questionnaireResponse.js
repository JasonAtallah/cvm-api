const context = require('../../../lib/context');

// vendor-flowers 'number' types changes to strings
describe('submit questionnaire response', function () {

  it('should return response and vendorId', function () {
    return context.requests.run('post-questionnaireResponse', { questionnaireResponse: context.env.questionnaireResponse })
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.deep.include({
          company: {
            name: context.env.questionnaireResponse.company.name,
            city: context.env.questionnaireResponse.company.city
          },
          contact: {
            firstName: context.env.questionnaireResponse.contact.firstName,
            email: context.env.questionnaireResponse.contact.email
          }
        });
      });
  });
});