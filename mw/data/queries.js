const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');

module.exports = {

  prepBuyerLocationInsert(req, res, next) {
    req.buyerUpdate = {
      query: {
        _id: new ObjectID(req.userId)
      },
      update: {
        $push: {
          locations: req.location
        }
      }
    };
    next();
  },

  prepBuyerQueryFromAuth(req, res, next) {
    req.buyerQuery = {
      _id: new ObjectID(req.userId)
    };
    next();
  },

  prepBuyerQueryFromQuestionnaire(req, res, next) {
    req.buyerQuery = {
      _id: new ObjectID(req.questionnaire.buyerId)
    };
    next();
  },

  prepBuyerQueryFromBody(req, res, next) {
    req.buyerQuery = {
      _id: new ObjectID(req.body.buyerId)
    };
    next();
  },

  prepBuyerQueryFromThread(req, res, next) {
    req.buyerQuery = {
      _id: req.thread.buyer._id
    };
    next();
  },

  prepEmailTemplateUpdate(req, res, next) {
    req.emailTemplateUpdate = {
      $set: {
        [`emails.${req.params.templateId}`]: {
          subject: req.body.subject,
          body: req.body.body
        }
      }
    };
    next();
  },

  prepQuestionnaireQueryById(req, res, next) {
    req.questionnaireQuery = {
      _id: new ObjectID(req.params.questionnaireId)
    };
    next();
  },

  prepQuestionnairePageUpdate(req, res, next) {
    req.questionnaireUpdate = {
      $set: {}
    };

    for (let page in req.body) {
      req.questionnaireUpdate.$set[`${page}`] = req.body[page];
    }

    next();
  },

  prepQuestionnaireQueryFromAuth(req, res, next) {
    req.questionnaireQuery = {
      buyerId: new ObjectID(req.userId)
    };
    next();
  },

  prepThreadAttributeUpdate(req, res, next) {
    req.attributeUpdate = {
      $set: {}
    };

    for (let attribute in req.body) {
      req.attributeUpdate.$set[`attributes.${attribute}`] = req.body[attribute];
    }

    next();
  },

  prepThreadQueryForBuyerVendor(req, res, next) {
    req.threadQuery = {
      'vendor._id': req.vendor._id,
      'buyer._id': req.buyer._id
    };
    next();
  },

  prepThreadQueryForVendorInUrl(req, res, next) {
    req.threadQuery = {
      'vendor._id': new ObjectID(req.params.vendorId)
    };
    next();
  },

  prepVendorIdList(req, res, next) {
    req.vendorIdList = req.vendors.map(v => v._id);
    next();
  },

  prepVendorListQueryForLoggedInBuyer(req, res, next) {
    req.threadQuery = {
      'buyer._id': new ObjectID(req.userId)
    };

    if (req.vendorIdList) {
      req.threadQuery['vendor._id'] = {
        $in: req.vendorIdList
      };
    }

    next();
  },

  prepVendorSearchQuery(req, res, next) {
    req.vendorQuery = {
      $or: [
        { 'company.name': { $regex: req.query.q, $options: 'i' } },
        { 'company.city': { $regex: req.query.q, $options: 'i' } },
        { 'contact.firstName': { $regex: req.query.q, $options: 'i' } },
        { 'contact.lastName': { $regex: req.query.q, $options: 'i' } }
      ]
    };
    req.vendorProjection = {
      _id: 1
    };
    next();
  },

  prepVendorQueryFromUrl(req, res, next) {
    req.vendorQuery = {
      _id: new ObjectID(req.params.vendorId)
    };
    next();
  }
};
