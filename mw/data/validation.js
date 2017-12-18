const config = require('../../config');

module.exports = {

  validateNewVendor(req, res, next) {
    let err;

    if (!req.vendor.company.name) {
      err = new Error('Company name is required');
    } else if (!req.vendor.company.city) {
      err = new Error('Company city is required');
    } else if (!req.vendor.contact.email) {
      err = new Error('Contact email is required');
    }

    if (err) {
      err.status = 400;
      next(err);
    } else {
      next();
    }
  }

};
