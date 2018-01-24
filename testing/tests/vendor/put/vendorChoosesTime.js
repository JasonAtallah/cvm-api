const context = require('../../../lib/context');

describe('vendor chooses time', function () {

  it('should return 400 buyer has not sent times yet', function() {

    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTximes,
      vendorUrl: context.data.vendorUrl,
      selectedTime: context.data.suggestedTimes[0]
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-vendorChoosesTime'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
  });

  it('should return 400 selectedTime not in suggestedTimes', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      vendorUrl: context.data.vendorUrl,
      selectedTime: context.data.badSelectedTime
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes',
      'put-vendorChoosesTime'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(400);
      });
  });

  describe('missing fields', function() {

    it('should return 400 missing location name', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.name': null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 missing location zip', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.zip': null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 missing location city', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.city': null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 missing location state', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.state': null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 missing duration', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { duration: null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 missing startDate', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { startDate: null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

  });

  describe('empty fields', function() {

    it('should return 400 empty location name', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.name': '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 empty location zip', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.zip': '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 empty location city', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.city': '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 empty location state', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { 'location.state': '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 empty duration', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { duration: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 empty startDate', function () {
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        vendorUrl: context.data.vendorUrl,
        selectedTime: context.data.get('suggestedTimes[0]', { startDate: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': 'body._id' }],
        'put-vendorApproved',
        'put-buyerSendsTimes',
        'put-vendorChoosesTime'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

  });

  it('should return vendor with updated state', function () {
    this.timeout(3000);
    
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
      vendorUrl: context.data.vendorUrl,
      selectedTime: context.data.suggestedTimes[0]
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id' }],
      'put-vendorApproved',
      'put-buyerSendsTimes',
      'put-vendorChoosesTime'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('_id', 'name', 'state');
        context.expect(response.body._id).to.equal(localEnv.VENDOR_ID);
        context.expect(response.body.name).to.equal(localEnv.vendor.company.name);
        context.expect(response.body.state).to.deep.include({ name: 'ApptScheduled' });
        context.expect(response.body.state.selectedTime).to.deep.equal(localEnv.selectedTime);
      });
  });

});
