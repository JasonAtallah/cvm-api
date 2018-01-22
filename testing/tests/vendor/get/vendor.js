const context = require('../../../lib/context');

describe('get vendor', function () {

  it('should return vendor', function () {

    const localEnv = {
      vendor: context.data.vendor1
    }

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' } ],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'vendor-get-vendor'
    ]
    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'company', 'contact', 'flowers', 'edibles', 'concentrates');
        context.expect(response.body.company).to.deep.include({
          name: localEnv.vendor.company.name,
          city: localEnv.vendor.company.city
        });
        context.expect(response.body.contact).to.deep.include({
          firstName: localEnv.vendor.contact.firstName,
          email: localEnv.vendor.contact.email
        });
        context.expect(response.body.flowers.products).to.be.an('array');
        context.expect(response.body.edibles.products).to.be.an('array');
        context.expect(response.body.concentrates.products).to.be.an('array');

      });
  });
});
