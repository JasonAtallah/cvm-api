const context = require('../../../lib/context');

describe('get a vendor', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-vendor', { VENDOR_ID: context.data.VENDOR_ID})
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('invalid vendor id', function() {
  
    it('should return 400 invalid vendor id', function() {
      const localEnv = {
        vendor: context.data.vendor1,
        VENDOR_ID: 'abc'
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],        
        'get-vendor'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);          
        });
    });

    it('should return 404 non existing vendor id', function() {
      const localEnv = {
        vendor: context.data.vendor1,
        VENDOR_ID: '5a5e89c1fa4e933ba969c1ef'
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'get-vendor'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {          
          context.expect(response.statusCode).to.equal(404);          
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
        context.expect(response.body).to.have.property('_id');
        context.expect(response.body).to.have.property('company');
        context.expect(response.body).to.have.property('contact');
        context.expect(response.body).to.have.property('flowers');
        context.expect(response.body).to.have.property('edibles');
        context.expect(response.body).to.have.property('concentrates');
      });
  });

});