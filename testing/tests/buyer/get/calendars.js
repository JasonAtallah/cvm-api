/*
getting all calendars returns a 400 "Unexpected token n in JSON at position 0"
works fine in Postman
*/
const context = require('../../../lib/context');

describe('get calendars', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-calendars')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return all calendars', function () {
    this.timeout(5000);
    const localEnv = {};

    const requestList = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      'get-calendars'
    ];

    return context.requests.runAll(requestList, localEnv)
      .then((response) => {
        context.expect(response.statusCode).to.equal(200, response.body);
        context.expect(response.body).to.be.an('array');        
      })
  });


});