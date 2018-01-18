const _ = require('lodash');
const context = require('../../../lib/context');

describe('add a new location', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-location', { location: context.data.location })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('missing fields', function () {

    it('should return a 400 empty name field', function () {
      const testLocation = context.data.location
      const localEnv = {
        location: context.data.get(testLocation, { name: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return a 400 missing name field', function () {    
      const testLocation = context.data.location  
      const localEnv = {
        location: context.data.get(testLocation, { name: null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return a 400 empty address field', function () { 
      const testLocation = context.data.location     
      const localEnv = {
        location: context.data.get(testLocation, { address: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return a 400 empty city field', function () {    
      const testLocation = context.data.location  
      const localEnv = {        
        location: context.data.get(testLocation, { city: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return a 400 empty state field', function () {
      const testLocation = context.data.location
      const localEnv = {
        location: context.data.get(testLocation, { state: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return a 400 empty zip field', function () {     
      const testLocation = context.data.location 
      const localEnv = {
        location: context.data.get(testLocation, { zip: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });


  });

  it('should return the new location', function () {
    const localEnv = {
      location: context.data.location
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'post-location'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.deep.equal(context.data.location);
      });
  });

});