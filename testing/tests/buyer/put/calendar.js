const context = require('../../../lib/context');

describe('Set calendar to new gCalendar', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('put-calendar')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  describe('missing fields', function() {

    it('should return 400 missing calendar name', function() {
      const localEnv = {
        calendar: context.data.get('calendar', { name: null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body'}],
        'put-calendar'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 missing calendar timezone', function() {
      const localEnv = {
        calendar: context.data.get('calendar', { timezone: null })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body'}],
        'put-calendar'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

  });

  describe('empty fields', function() {

    it('should return 400 empty calendar name', function() {
      const localEnv = {
        calendar: context.data.get('calendar', { name: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body'}],
        'put-calendar'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

    it('should return 400 empty calendar timezone', function() {
      const localEnv = {
        calendar: context.data.get('calendar', { timezone: '' })
      };

      const requestList = [
        ['post-token', { 'BUYER_TOKEN': 'body'}],
        'put-calendar'
      ];

      return context.requests.runAll(requestList, localEnv)
        .then((response) => {
          context.expect(response.statusCode).to.equal(400);
        });
    });

  });

  it('should return new calendar', function () {
    this.timeout(10000);
    return context.requests.run('post-token')
      .then((response) => {        
        return context.requests.run('put-calendar', { BUYER_TOKEN: response.body, calendar: context.data.newCalendar })
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);
            context.expect(response.body).to.be.an('object');
          });
      });
    });
      
  });