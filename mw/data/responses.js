const _ = require('lodash');
const config = require('../../config');
const mappings = require('../../lib/mappings');

module.exports = {

  prepBuyerForResponse(req, res, next) {
    req.buyer = Object.assign(_.pick(req.buyer, ['_id', 'emails', 'gcalendar', 'schedule']), {
      firstName: req.buyer.gProfile.firstName
    });
    next();
  },

  prepThreadForVendorResponse(req, res, next) {
    req.vendor = mappings.mapThreadToVendor(req.thread);
    next();
  },

  prepQuestionnaireForResponse(req, res, next) {
    req.questionnaire = _.omit(req.questionnaire, ['buyerId']);
    next();
  },

  prepVendorForResponse(req, res, next) {
    req.vendor = _.omit(req.vendor, ['buyerId']);
    next();
  },

  prepVendorListForReponse(req, res, next) {
    req.vendors = req.vendors.map(mappings.mapThreadToVendor);
    next();
  }
};
