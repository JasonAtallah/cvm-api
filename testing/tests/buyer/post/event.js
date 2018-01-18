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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { name: '' })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { location: '' })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { time: '' })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { date: '' })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { duration: '' })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { name: null })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { location: null })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { time: null })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { date: null })
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
      const testEvent = context.data.event;
      const localEnv = {
        event: context.data.get(testEvent, { duration: null })
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

  it('should return the new event', function () {
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
        context.expect(response.body).to.deep.include({
          status: 'confirmed',
          title: context.data.event.name
        });        
      })
  });

});