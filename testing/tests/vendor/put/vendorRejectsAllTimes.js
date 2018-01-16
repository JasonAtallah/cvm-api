const context = require('../../../lib/context');

describe('vendor rejects all times', function () {

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
                  .then(() => {
                    return context.requests.run('put-vendorRejectsAllTimes')
                      .then((response) => {
                        context.expect(response.statusCode).to.equal(200);
                        context.expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes' });
                        context.expect(response.body.state.rejectedTimes).to.not.be.null;
                      });
                  });
              });
          });
      });
  });
  
});