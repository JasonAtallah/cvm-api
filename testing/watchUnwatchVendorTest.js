const expect = require('chai').expect;
const Requests = require('./lib/Requests');
const collection = require('./CannabisVendorMgmt.postman_collection.json');
const env = require('./env');
const requests = new Requests(collection, env);

module.exports = describe('Reject vendor test', function () {

  describe('Create and reject vendor', function() {
    it('should create and reject a vendor', function() {
      return requests.run('post-token')
        .then((response) => {
          env.BUYER_TOKEN = response.body;
          return requests.run('post-vendor', { vendor: env.vendor1 })
        })
        .then((response) => {      
          env.VENDOR_ID = response.body._id;
          return requests.run('put-vendorRejected', { email: env.rejectionEmail })
        });
    })
  });

  describe('Watch Vendor', function() {
    it('should watch vendor', function() {
      return requests.run('put-watchVendor')
        .then((response) => {
          expect(response.statusCode).to.equal(201);
        });
    });
  });

  describe('Unwatch Vendor', function() {
    it('should unwatch vendor', function() {
      return requests.run('put-unwatchVendor')
        .then((response) => {
          expect(response.statusCode).to.equal(201);
        });
    });
  });

});