const dotenv = require('dotenv');
const config = require('../../config');
const BUYER_ID = require('../env.js').BUYER_ID;
const ObjectId = require('mongodb').ObjectID;

dotenv.load();
config.load();

config.mongo.getDB
  .then((db) => {
    return Promise.all([
      db.collection('threads').remove({ 'vendor.name': { $regex: '^unit test', $options: 'i' }}),
      db.collection('vendors').remove({ 'company.name': { $regex: '^unit test', $options: 'i' }}),      
      db.collection('buyers').update(
        {'_id': ObjectId(BUYER_ID)}, 
        { $pull: { 'locations' : { 'name': { $regex: '^unit test' } } } },
        { multi: true }
    )
    ])
  })
  .then(() => {
    console.log('Complete');
    process.exit();
  });