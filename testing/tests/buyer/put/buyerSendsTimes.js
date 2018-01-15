const context = require('../../../lib/context');

describe('buyer sends times', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-buyerSendsTimes', { vendor: context.env.vendor1 })
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return vendor with updated state', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('post-vendor', { vendor: context.env.vendor1 })
          .then((response) => {
            context.env.VENDOR_ID = response.body._id;
            return context.requests.run('put-vendorApproved', { email: context.env.approvalEmail })
              .then(() => {                
                return context.requests.run('put-buyerSendsTimes', { suggestedTimes: context.env.suggestedTimes })
                  .then((response) => {
                    context.expect(response.statusCode).to.equal(200);
                    context.expect(response.body).to.deep.include({ name: context.env.vendor1.company.name });
                    context.expect(response.body.state).to.deep.include({ name: 'VendorNeedsToReviewTimes'});
                    context.expect(response.body.state.suggestedTimes).to.not.have.lengthOf(0);
                  })
              });
          });
      });
  });
  
});