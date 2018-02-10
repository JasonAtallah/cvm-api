const _ = require('lodash');
const context = require('../../../testing/lib/context');

describe('get vendors', function () {

  it('should return 401 Unauthorized without buyer token', function () {
    return context.requests.run('get-vendors')
      .then((response) => {
        context.expect(response.statusCode).to.equal(401);
      });
  });

  it('should return all vendors', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      query: ''
    };

    const requestList1 = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'vendor1': 'body' }]
    ];

    const requestList2 = [
      ['post-vendor', { 'vendor2': 'body' }],
      'get-vendors'
    ];

    return context.requests.runAll(requestList1, localEnv)
      .then(() => {
        localEnv.vendor = context.data.vendor2;
        return context.requests.runAll(requestList2, localEnv);
      })
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('array');
        context.expect(response.body.length).to.equal(2);
        response.body = _.sortBy(response.body, '_id');
        context.expect(response.body[0]).to.have.property('_id');
        context.expect(response.body[0]).to.have.property('name');
        context.expect(response.body[0]).to.have.property('state');
        context.expect(response.body[0]._id).to.equal(localEnv.vendor1._id);
        context.expect(response.body[1]).to.have.property('_id');
        context.expect(response.body[1]).to.have.property('name');
        context.expect(response.body[1]).to.have.property('state');
        context.expect(response.body[1]._id).to.equal(localEnv.vendor2._id);
      });
  });

  it('should return matching vendors with query', function () {
    const localEnv = {
      vendor: context.data.vendor1,
      query: context.data.vendor2.company.name
    };

    const requestList1 = [
      ['post-token', { 'BUYER_TOKEN': 'body' }],
      ['post-vendor', { 'vendor1': 'body' }]
    ];

    const requestList2 = [
      ['post-vendor', { 'vendor2': 'body' }],
      'get-vendors'
    ];

    return context.requests.runAll(requestList1, localEnv)
      .then(() => {
        localEnv.vendor = context.data.vendor2;
        return context.requests.runAll(requestList2, localEnv);
      })
      .then((response) => {
        context.expect(response.statusCode).to.equal(200);
        context.expect(response.body).to.be.an('array');
        context.expect(response.body.length).to.equal(1);
        response.body = _.sortBy(response.body, '_id');
        context.expect(response.body[0]).to.have.property('_id');
        context.expect(response.body[0]).to.have.property('name');
        context.expect(response.body[0]).to.have.property('state');
        context.expect(response.body[0]._id).to.equal(localEnv.vendor2._id);
      });
  });

});
