const context = require('../../../lib/context');

describe('get a vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-vendor', { VENDOR_ID: context.data.VENDOR_ID})
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('invalid vendor id', function() {
    it('should return 400 missing vendor id', function() {
      const localEnv = {
        vendor: context.data.vendor1,
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': null}],
        'get-vendor'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
  
    it('should return 400 empty vendor id', function() {
      const localEnv = {
        vendor: context.data.vendor1,
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': ''}],
        'get-vendor'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);          
        });
    });

    it('should return 400 non existing vendor id', function() {
      const localEnv = {
        vendor: context.data.vendor1,
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        ['post-vendor', { 'VENDOR_ID': '5a6162a2d534ba0aa794e794'}],
        'get-vendor'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);          
        });
    });
  })
 
  it('should return the vendor', function () {
    const localEnv = {
      vendor: context.data.vendor1,
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'VENDOR_ID': 'body._id'}],
      'get-vendor'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.body.company).to.deep.equal(localEnv.vendor.company);
        context.expect(response.body.contact).to.deep.equal(localEnv.vendor.contact);
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
      });
  });

});