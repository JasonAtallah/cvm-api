const DateTime = require('luxon').DateTime;
const context = require('../../../testing/lib/context');

describe('create a new event', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    const localEnv = {
      event: context.data.event
    };

    const requestList = [
      'post-event'
    ];

    return context.requests.runAll(requestList, localEnv)
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

    it('should return a 400 for empty dateTime field', function () {
      const localEnv = {
        event: context.data.get('event', { dateTime: '' })
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

    it('should return a 400 for missing dateTime field', function () {
      const localEnv = {
        event: context.data.get('event', { dateTime: null })
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

    const startDate = DateTime.fromJSDate(new Date(localEnv.event.dateTime), { zone : localEnv.event.timezone });

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200, response.body);
        context.expect(response.body).to.be.an('object');
        context.expect(response.body).to.have.property('id');
        context.expect(response.body).to.have.property('htmlLink');
        context.expect(response.body).to.have.property('created');
        context.expect(response.body).to.have.property('updated');
        context.expect(response.body).to.deep.include({
          status: 'confirmed',
          title: context.data.event.name,
          startDate: startDate.toISO({ suppressMilliseconds: true }),
          endDate: startDate.plus({ minutes: localEnv.event.duration }).toISO({ suppressMilliseconds: true })
        });
      });
  });

});
