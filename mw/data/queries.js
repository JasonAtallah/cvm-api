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

  prepQuestionnaireQueryById(req, res, next) {
    req.questionnaireQuery = {
      _id: new ObjectID(req.params.questionnaireId)
    };
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

  prepVendorListQueryForLoggedInBuyer(req, res, next) {
    req.vendorQuery = {
      'buyer._id': new ObjectID(req.userId)
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
      vendor: 1,
      state: 1,
      attributes: 1
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
