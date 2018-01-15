const context = require('../../../lib/context');

describe('create vendor', function() {
  
  it('should return 401 Unauthorized without buyer token', function() {
    return context.requests.run('post-vendor-success', { vendor: context.env.vendor1 })      
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);        
      });
  });

  it('should return vendor with right values', function() {
    return context.requests.run('post-token-success')
      .then((response) => {
        let token = response.body;
        return context.requests.run('post-vendor-success', { BUYER_TOKEN: token, vendor: context.env.vendor1 })
          .then((response) => {
            context.expect(response.statusCode).to.equal(201);
            context.expect(response.body.name).to.equal(context.env.vendor1.company.name);
            context.expect(response.body.state).to.deep.include({ name: 'NewVendor' });
          });
      });
  });

});