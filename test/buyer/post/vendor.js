const context = require('../../../testing/lib/context');

describe('create vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    const localEnv = {
      vendor: context.data.vendor1
    };

    const requestList = [
      ['post-vendor', { 'VENDOR_ID': 'body._id' }]
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      })
  });

  describe('empty fields', function () {
    it('should return 400 empty company field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { company: '' })
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
    it('should return 400 empty contact field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { contact: '' })
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

    it('should return 400 empty company name field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { 'company.name': '' })
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

    it('should return 400 empty contact firstName field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { 'contact.firstName': '' })
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

    it('should return 400 empty contact email field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { 'contact.email': '' })
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

  describe('missing fields', function () {
    it('should return 400 missing company field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { company: null })
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
    it('should return 400 missing contact field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { contact: null })
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
      const localEnv = {
        vendor: context.data.get('vendor1', { 'company.name': null })
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

    it('should return 400 missing contact firstName field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { 'contact.firstName': null })
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

    it('should return 400 missing contact email field', function () {
      const localEnv = {
        vendor: context.data.get('vendor1', { 'contact.email': null })
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
        context.expect(response.body).to.have.all.keys('_id', 'name', 'state');
        context.expect(response.body).to.have.property('name');
        context.expect(response.body.state).to.deep.include({ name: 'NewVendor' });
      })
  });

});
