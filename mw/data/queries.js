const ObjectID = require('mongodb').ObjectID;
const config = require('../../config');

module.exports = {

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

  prepVendorQueryFromUrl(req, res, next) {
    req.vendorQuery = {
      _id: new ObjectID(req.params.vendorId)
    };
    next();
  },

  prepQuestionnaireQueryById(req, res, next) {
    req.questionnaireQuery = {
      _id: new ObjectID(req.params.questionnaireId)
    };
    next();
  },

  prepThreadQueryForVendorInUrl(req, res, next) {
    req.threadQuery = {
      'vendor._id': new ObjectID(req.params.vendorId),
      'buyer._id': new ObjectID(req.userId)
    };
    next();
  },

  prepVendorListQueryForLoggedInBuyer(req, res, next) {
    req.vendorQuery = {
      "buyer._id": new ObjectID(req.userId)
    };

    if (req.query.status) {
      if (req.query.status === 'New') {
        req.vendorQuery['state.name'] = 'NewVendor';
      } else if (req.query.status === 'Rejected') {
        req.vendorQuery['state.name'] = 'VendorRejected';
      } else if (req.query.status === 'Approved') {
        req.vendorQuery['state.name'] = {
          '$in': [
            'AwaitingBuyerAppointmentTimes',
            'AwaitingVendorAppointmentTimes'
          ]
        };
      }
    }

    req.vendorProjection = {
      "vendor": 1,
      "state": 1
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
