const context = require('../../../lib/context');

describe('vendor chooses time', function () {

  it('should return 400 selectedTime not in suggestedTimes', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
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
      const selectedTime = context.data.suggestedTimes[0];
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        selectedTime: context.data.get(selectedTime, { location: null })
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
      const selectedTime = context.data.suggestedTimes[0];
      const localEnv = {
        vendor: context.data.vendor1,
        email: context.data.approvalEmail,
        suggestedTimes: context.data.suggestedTimes,
        selectedTime: context.data.get(selectedTime, { location: '' })
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

  it('should return 400 selectedTime not in suggestedTimes', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
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

  it('should return vendor with updated state', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      email: context.data.approvalEmail,
      suggestedTimes: context.data.suggestedTimes,
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
        context.expect(response.body._id).to.equal(localEnv.VENDOR_ID)
        context.expect(response.body.name).to.equal(localEnv.vendor.company.name)
        context.expect(response.body.state).to.deep.include({ name: 'ApptScheduled' });
        context.expect(response.body.state.selectedTime).to.deep.equal(localEnv.selectedTime);
      });
  });

});
