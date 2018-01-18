/*
Status code 400 is being returned on the missing fields but locations with name, and location
missing are still being created with those fields being undefined

tests with time and date field missed are returning a 500
*/
const _ = require('lodash');
const context = require('../../../lib/context');

describe('create a new event', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-event', { event: context.data.event })
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('empty fields', function() {
    
    it('should return a 400 for empty name field', function () {
      const localEnv = {
        event: context.data.get('event', { name: '' })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for empty location field', function () {
      const localEnv = {
        event: context.data.get('event', { location: '' })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for empty time field', function () {
      const localEnv = {
        event: context.data.get('event', { time: '' })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for empty date field', function () {
      const localEnv = {
        event: context.data.get('event', { date: '' })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for empty duration field', function () {
      const localEnv = {
        event: context.data.get('event', { duration: '' })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

  });
 
  describe('missing fields', function() {
    
    it('should return a 400 for missing name field', function () {
      const localEnv = {
        event: context.data.get('event', { name: null })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for missing location field', function () {
      const localEnv = {
        event: context.data.get('event', { location: null })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for missing time field', function () {
      const localEnv = {
        event: context.data.get('event', { time: null })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for missing date field', function () {
      const localEnv = {
        event: context.data.get('event', { date: null })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });
    
    it('should return a 400 for missing duration field', function () {      
      const localEnv = {
        event: context.data.get('event', { duration: null })
      };
  
      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-event'
      ];
  
      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          console.log(localEnv.event);
          context.expect(response.statusCode).to.equal(400);
        });
    });

  });

  it('should return the new event', function () {
    this.timeout(5000);
    const localEnv = {
      event: context.data.event
    };

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'post-event'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.deep.include({
          status: 'confirmed',
          title: context.data.event.name
        });        
      })
  });

});