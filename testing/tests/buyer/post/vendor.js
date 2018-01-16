const context = require('../../../lib/context');

describe('create vendor', function() {
  
  it('should return 401 Unauthorized without buyer token', function() {
    return context.requests.run('post-vendor', { vendor: context.data.vendor1 })      
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);        
      });
  });

  it('should return vendor with right values', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail
    };
  
    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }]
    ];
  
    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(201);
        context.expect(response.body.name).to.equal(context.data.vendor1.company.name);
        context.expect(response.body.state).to.deep.include({ name: 'NewVendor' });
      })
  });

});
