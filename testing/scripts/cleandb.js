const dotenv = require('dotenv');
const config = require('../../config');

dotenv.load();
config.load();

config.mongo.getDB
  .then((db) => {
    return Promise.all([
      db.collection('threads').remove({ 'vendor.name': { $regex: '^Vendor', $options: 'i' }}),
      db.collection('vendors').remove({ 'company.name': { $regex: '^Vendor', $options: 'i' }})
    ])
  })
  .then(() => {
    console.log('Complete');
    process.exit();
  });