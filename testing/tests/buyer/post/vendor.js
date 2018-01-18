const context = require('../../../lib/context');

describe('create vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-vendor', { vendor: context.data.vendor1 })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('missing fields', function () {
    it('should return 400 empty company name field', function () {

      const testVendor = context.data.vendor1
      const localEnv = {
        vendor: context.data.get(testVendor, { 'company.name': '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }]
      ]

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 missing company name field', function () {

      const testVendor = context.data.vendor1
      const localEnv = {
        vendor: context.data.get(testVendor, { 'company.name': null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }]
      ]

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
  });

  it('should return vendor with right values', function () {
    const localEnv = {
      vendor: context.data.vendor1
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }]
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(201);
        context.expect(response.body.name).to.equal(localEnv.vendor.company.name);
        context.expect(response.body.state).to.deep.include({ name: 'NewVendor' });
      })
  });

});
