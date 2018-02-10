const dotenv = require('dotenv');
const _ = require('lodash');
const config = require('../config');

dotenv.load();
config.load();

const data = require('../docs/data.json');
const context = require('../testing/lib/context');

before(function(done) {
  let db;
  let buyer;
  let questionnaire;

  config.mongo.getDB
    .then((database) => {
      db = database;
    })
    .then(() => {
      return Promise.all([
        db.collection('vendors').remove({}),
        db.collection('threads').remove({}),
        db.collection('questionnaires').remove({})
      ]);
    })
    .then(() => {
      const buyerValues = _.cloneDeep(data.buyer);
      buyerValues.gProfile.id = process.env.TEST_BUYER_GPROFILE_ID;
      buyerValues.gProfile.email = process.env.TEST_BUYER_EMAIL;
      buyerValues.profile.contact.email = process.env.TEST_BUYER_EMAIL;
      buyerValues.gcalendar.id = process.env.TEST_BUYER_GCALENDAR_ID;
      buyerValues.gAuth.access_token = process.env.TEST_BUYER_GAUTH_ACCESS_TOKEN;
      buyerValues.gAuth.refresh_token = process.env.TEST_BUYER_GAUTH_REFRESH_TOKEN;

      const buyerQuery = {
        'gProfile.id': buyerValues.gProfile.id
      };

      const buyerOptions = {
        upsert: true,
        returnOriginal: false
      };

      return db.collection('buyers').findOneAndUpdate(buyerQuery, buyerValues, buyerOptions);
    })
    .then((result) => {
      buyer = result.value;
    })
    .then(() => {
      const questionnaireValues = _.cloneDeep(data.questionnaire);
      questionnaireValues.buyerId = buyer._id;

      const questionnaireQuery = {
        buyerId: buyer._id
      };

      const questionnaireOptions = {
        upsert: true,
        returnOriginal: false
      };

      return db.collection('questionnaires').findOneAndUpdate(questionnaireQuery, questionnaireValues, questionnaireOptions);
    })
    .then((result) => {
      questionnaire = result.value;
    })
    .then(() => {
      context.env.BUYER_ID = buyer._id.toString();
      context.env.QID = questionnaire._id.toString();
      done();
    })
    .catch((err) => {
      console.dir(err);
      done(err);
    });
})
