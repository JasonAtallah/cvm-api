const expect = require('chai').expect;
const Requests = require('./lib/Requests');

const collection = require('./CannabisVendorMgmt.postman_collection.json');
const env = require('./env');
const requests = new Requests(collection, env);

const watchUnwatchVendor = require('./watchUnwatchVendorTest');
// const getBuyerToken = require('./tests/buyer/post/token-success');
// const createVendor = require('./tests/buyer/post/vendor-success');
// const rejectVendor = require('./tests/buyer/put/vendorRejected-success');
watchUnwatchVendor;

// getBuyerToken;`

// describe('approve vendor', function() {
//   it('should return vendor with updated state', function() {
//         return requests.run('put-vendorApproved-success', { email: env.approvalEmail })
//           .then((response) => {            
//             expect(response.statusCode).to.equal(200);
//             expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes'})
//       });        
//   });
// });

// describe('buyer sends times', function() {
//   it('should return vendor with updated state', function() {
//     return requests.run('put-buyerSendsTimes-success')
//       .then((response) => {
//         console.log(env.suggestedTimes);
//         expect(response.statusCode).to.equal(200);
//         expect(response.body.state).to.deep.include({ name: 'VendorNeedsToReviewTimes'});
//         expect(response.body.state.suggestedTimes).to.not.be.null;
//       });
//   });
// });

// describe('vendor rejects all times', function() {
//   it('should return vendor with updated state', function() {
//     return requests.run('put-vendorRejectsAllTimes-success')
//       .then((response) => {
//         expect(response.statusCode).to.equal(200);
//         expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes'});     
//         expect(response.body.state.rejectedTimes).to.not.be.null;       
//       });
//   });
// });

// describe('buyer sends new times', function() {
//   it('should return vendor with updated state', function() {
//     return requests.run('put-buyerSendsTimes-success')
//       .then((response) => {
//         expect(response.statusCode).to.equal(200);
//         expect(response.body.state).to.deep.include({ name: 'VendorNeedsToReviewTimes'});
//         expect(response.body.state.suggestedTimes).to.not.be.null;
//         expect(response.body.state.rejectedTimes).to.not.be.null;
//       });
//   });
// });

// describe('vendor chooses time', function() {
//   it('should return vendor with updated state', function() {
//     return requests.run('put-vendorChoosesTime-success')
//       .then((response) => {
//         expect(response.statusCode).to.equal(200);
//         expect(response.body.state).to.deep.include({ name: 'ApptScheduled'});
//         expect(response.body.state.suggestedTimes).to.not.be.null;
//         expect(response.body.state.rejectedTimes).to.not.be.null;
//         // assert selectedTime in suggestedTimes
//       });
//   });
// });

// describe('buyer cancels appt', function() {
//   it('should return vendor with updated state', function() {
//     return requests.run('put-buyerCancelsAppt-success')
//       .then((response) => {
//         expect(response.statusCode).to.equal(200);
//         expect(response.body.state).to.deep.include({ name: 'BuyerNeedsToSendTimes' });        
//         expect(response.body.state.rejectedTimes).to.not.be.null;
//       });
//   });
// });

// describe('vendor cancels appt', function() {  
//   it('should return vendor with updated state', function() {
//     return requests.run('put-vendorCancelsAppt-success')
//       .then((response) => {
//         expect(response.statusCode).to.equal(200);
//         expect(response.body.state).to.deep.include({ name: 'buyerNeedsToSendTimes' });
//         expect(response.body.rejectedTimes).to.not.be.null;
//       })
//   })
// });