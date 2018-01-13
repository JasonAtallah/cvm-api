const dotenv = require('dotenv');
const config = require('../../config');

dotenv.load();
config.load();

config.mongo.getDB
  .then((db) => {
    return Promise.all([
      db.collection('threads').remove({ 'vendor.name': { $regex: '^Test', $options: 'i' }}),
      db.collection('vendors').remove({ 'company.name': { $regex: '^Test', $options: 'i' }})
    ])
  });