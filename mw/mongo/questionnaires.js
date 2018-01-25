const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');

module.exports = {

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