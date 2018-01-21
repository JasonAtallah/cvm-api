const context = require('../../../lib/context');

describe('reject vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    const localEnv = {
      VENDOR_ID: context.data.VENDOR_ID,
      email: context.data.rejectionEmail
    };

    const requestList = [
      'put-vendorRejected'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('missing fields in email', function () {

    it('should return 400 missing email subject', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.get('rejectionEmail', { subject: null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorRejected'
      ];

      return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
    });

    it('should return 400 missing email body', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.get('rejectionEmail', { body: null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorRejected'
      ];

      return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
    });

  });

  describe('empty fields in email', function () {

    it('should return 400 missing email subject', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.get('rejectionEmail', { subject: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorRejected'
      ];

      return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
    });

    it('should return 400 empty email body', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.get('rejectionEmail', { body: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorRejected'
      ];

      return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
    });

  });

  it('should return vendor with updated state', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.rejectionEmail
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorRejected'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'name', 'state');
        context.expect(response.body.state).to.deep.include({ name: 'VendorRejected' });
        context.expect(response.body).to.deep.include({ name: context.data.vendor1.company.name });
        context.expect(response.body._id).to.equal(localEnv.VENDOR_ID);
        context.expect(response.body.name).to.equal(localEnv.vendor.company.name);
      });
  });

});