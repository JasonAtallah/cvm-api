const config = require('../config');

afterEach(function(done) {
  let db;
  
  config.mongo.getDB
    .then((database) => {
      db = database;
    })
    .then(() => {
      return Promise.all([
        db.collection('vendors').remove({})
      ]);
    })
    .then(() => {
      done();
    })
    .catch((err) => {
      console.dir(err);
      done(err);
    });
})
