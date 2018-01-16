const _ = require('lodash');
const context = require('../../../lib/context');

describe('add a new location', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-location', { location: context.data.location })
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  describe('missing fields', function () {

    it('should return a 400 missing name field', function () {
      
      const localEnv = {
        location: _.omit(context.data.location, 'name')
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .catch((err) => {
          context.expect(err.statusCode).to.equal(400);
        });
    });

    it('should return a 400 missing address field', function () {
      
      const localEnv = {
        location: _.omit(context.data.location, 'address')
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .catch((err) => {
          context.expect(err.statusCode).to.equal(400);
        });
    });

    it('should return a 400 missing city field', function () {
      
      const localEnv = {
        location: _.omit(context.data.location, 'city')
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .catch((err) => {
          context.expect(err.statusCode).to.equal(400);
        });
    });

    it('should return a 400 missing state field', function () {
      
      const localEnv = {
        location: _.omit(context.data.location, 'state')
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .catch((err) => {
          context.expect(err.statusCode).to.equal(400);
        });
    });

    it('should return a 400 missing zip field', function () {
      
      const localEnv = {
        location: _.omit(context.data.location, 'zip')
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body' }],
        'post-location'
      ];

      return context.requests.runAll(requestList, localEnv)
        .catch((err) => {
          context.expect(err.statusCode).to.equal(400);
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
      });
  });

});