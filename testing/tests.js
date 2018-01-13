const expect = require('chai').expect;
const Requests = require('./lib/Requests');

const collection = require('./CannabisVendorMgmt.postman_collection.json');
const env = require('./env');
const requests = new Requests(collection, env);

describe('CVM APIs', function() {
  describe('buyer/v1', function() {
    describe('get buyer token', function() {
      it('should return jwt token', function() {
        return requests.run('post-token-success')
          .then((response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.match(/^[\w\W]{100,}$/);
            env.BUYER_TOKEN = response.body;
          });
      });
    });
  
    describe('create vendor', function() {
      it('should return vendor with right values', function() {
        return requests.run('post-vendor-success', { vendor: env.vendor1 })
          .then((response) => {
            expect(response.statusCode).to.equal(201);
            expect(response.body.name).to.equal(env.vendor1.company.name);
            expect(response.body.state).to.deep.include({name: 'NewVendor'});
            env.VENDOR_ID = response.body._id;
          });
      });
    });
  });  

  describe('vendor/v1', function() {
    describe('get buyer token', function() {
      it('should return jwt token', function() {
        return requests.run('post-token-success')
          .then((response) => {
            expect(response.statusCode).to.equal(200);
            expect(response.body).to.match(/^[\w\W]{100,}$/);
            env.BUYER_TOKEN = response.body;
          });
      });
    });
  
    describe('create vendor', function() {
      it('should return vendor with right values', function() {
        return requests.run('post-vendor-success', { vendor: env.vendor1 })
          .then((response) => {
            expect(response.statusCode).to.equal(201);
            expect(response.body.name).to.equal(env.vendor1.company.name);
            expect(response.body.state).to.deep.include({name: 'NewVendor'});
            env.VENDOR_ID = response.body._id;
          });
      });
    });
  });
  
})

