const Ajv = require('ajv');
const debug = require('debug')('cvm-api.mw.data.validation');
const { ValidationError } = require('../../errors');
const config = require('../../config');

const schemas = {
  newCalendar: require('../../model/schemas/new-calendar.json'),
  newVendor: require('../../model/schemas/new-vendor.json')
};

const validators = {
  newCalendar: new Ajv().compile(schemas.newCalendar),
  newVendor: new Ajv().compile(schemas.newVendor)
};

module.exports = {

  validateNewCalendar(req, res, next) {
    debug('validateNewCalendar');
    var valid = validators.newCalendar(req.body);

    if (!valid) {
      next(new ValidationError(validators.newCalendar, req.body));
    } else {
      next();
    }
  },

  validateNewVendor(req, res, next) {
    debug('validateNewVendor');
    var valid = validators.newVendor(req.vendor);

    if (!valid) {
      next(new ValidationError(validators.newVendor, req.vendor));
    } else {
      next();
    }
  }

};
