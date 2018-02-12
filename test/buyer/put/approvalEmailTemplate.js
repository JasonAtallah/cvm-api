const context = require('../../../testing/lib/context');

describe('update buyer approval email template', function () {

  it('should return 401 unauthorized', function () {
    const localEnv = {
      rejectionEmail: context.data.rejectionEmail
    };

    const requestList = [
      'put-email-template.approveVendor'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return 200 Ok', function() {
    const localEnv = {
      rejectionEmail: context.data.rejectionEmail
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'put-email-template.approveVendor'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.have.all.keys('approveVendor', 'rejectVendor', 'newVendor');
      });
  });

});
