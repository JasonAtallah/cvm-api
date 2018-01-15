const context = require('../../../lib/context');

describe('add a new location', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-location')
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return the new location', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('post-location', { location: context.env.location })
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);      
            context.expect(response.body).to.deep.include({ 
              name: context.env.location.name,
              address: context.env.location.address,
              city: context.env.location.city,
              state: context.env.location.state,
              zip: context.env.location.zip
            });                          
          });
      });
  });

});