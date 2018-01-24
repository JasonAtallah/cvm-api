const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');

module.exports = {

  update(req, res, next) {
    const select = {
      _id: new ObjectID(req.body._id)
    };
    
    const update = req.questionnaireUpdate;

    const options ={
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