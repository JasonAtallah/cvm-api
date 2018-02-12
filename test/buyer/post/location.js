const context = require('../../../testing/lib/context');

describe('add a new location', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    const localEnv = {
      location: context.data.location
    };

    const requestList = [
      'post-location'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('empty fields', function () {

    it('should return a 400 empty name field', function () {
      const localEnv = {
        location: context.data.get('location', { name: '' })
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
      const localEnv = {
        location: context.data.get('location', { address: '' })
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
      const localEnv = {
        location: context.data.get('location', { city: '' })
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
      const localEnv = {
        location: context.data.get('location', { state: '' })
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
      const localEnv = {
        location: context.data.get('location', { zip: '' })
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

  describe('missing fields', function () {

    it('should return a 400 missing name field', function () {
      const localEnv = {
        location: context.data.get('location', { name: null })
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

    it('should return a 400 missing address field', function () {

      const localEnv = {
        location: context.data.get('location', { address: null })
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

    it('should return a 400 missing city field', function () {

      const localEnv = {
        location: context.data.get('location', { city: null })
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

    it('should return a 400 missing state field', function () {
      const localEnv = {
        location: context.data.get('location', { state: null })
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

    it('should return a 400 missing zip field', function () {

      const localEnv = {
        location: context.data.get('location', { zip: null })
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
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.all.keys('name', 'address', 'city', 'state', 'zip');
        context.expect(response.body).to.deep.equal(localEnv.location);
      });
  });

});
