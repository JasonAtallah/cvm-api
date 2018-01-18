const context = require('../../../lib/context');

describe('get vendor', function () {

  it('should return vendor', function () {

    const localEnv = {
      vendor: context.data.vendor1
    }

    const reqList = [
      ['post-token', { 'BUYER_TOKEN': 'body' } ],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'get-vendorAsVendor'
    ]
    return context.requests.runAll(reqList, localEnv)
      .then((response) => {        
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'company', 'contact', 'flowers', 'edibles', 'concentrates');        
      });
  });
});