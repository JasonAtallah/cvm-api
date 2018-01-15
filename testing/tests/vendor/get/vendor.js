const context = require('../../../lib/context');

describe('get vendor', function () {

  it('should return vendor', function () {
    return context.requests.run('get-vendor')
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.have.all.keys('_id', 'company', 'contact', 'flowers', 'edibles', 'concentrates');        
      });
  });
});