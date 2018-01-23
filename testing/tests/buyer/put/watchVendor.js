const context = require('../../../lib/context');

describe('start watching vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-watchVendor', { VENDOR_ID: context.env.VENDOR_ID })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return a 200 Ok', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.rejectionEmail
    };
  
    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorRejected',
      'put-watchVendor'
    ];
  
    return context.requests.runAll(requestList, localEnv)
      .then((response) => {                
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'name', 'state', 'attributes');
        context.expect(response.body.state).to.deep.include({ name: 'VendorRejected' });
        context.expect(response.body.attributes).to.deep.include({ watchVendor: true });
      });
  });

});