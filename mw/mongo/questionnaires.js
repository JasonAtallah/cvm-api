const _ = require('lodash');
const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');
const sampleQuestionnaire = require('../../docs/data.json').questionnaire;

module.exports = {

  initialize(req, res, next) {

    const questionnaire = {
      buyerId: req.buyer._id,
      pages: _.cloneDeep(sampleQuestionnaire.pages),
      introduction: '# Welcome',
      completion: '# Thanks for applying'
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('questionnaires').insert(questionnaire)
          .then((result) => {
            req.questionnaire = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  },

  update(req, res, next) {
    const select = {
      buyerId: new ObjectID(req.questionnaireQuery.buyerId)
    };
    
    const update = req.questionnaireUpdate;

    const options = {
      returnOriginal: false
    };

    config.mongo.getDB
      .then((db) => {
        return db.collection('questionnaires').findOneAndUpdate(select, update, options)
          .then((result) => {            
            req.questionnaire = result.value;
            next();
          });
      })
      .catch((err) => {
        next(err);
      });
  }

}