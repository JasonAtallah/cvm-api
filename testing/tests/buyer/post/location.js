const context = require('../../../lib/context');

describe('add a new location', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('post-location', { location: context.data.location })
      .catch((err) => {
        context.expect(err.statusCode).to.equal(401);
      });
  });

  it('should return the new location', function () {
    return context.requests.run('post-token')
      .then((response) => {
        context.env.BUYER_TOKEN = response.body
        return context.requests.run('post-location', { location: context.data.location })
          .then((response) => {
            context.expect(response.statusCode).to.equal(200);      
            context.expect(response.body).to.deep.include({ 
              name: context.data.location.name,
              address: context.data.location.address,
              city: context.data.location.city,
              state: context.data.location.state,
              zip: context.data.location.zip
            });                          
          });
      });
  });

});