const _ = require('lodash');
const Ajv = require('ajv');
const debug = require('debug')('cvm-api.mw.data.validation');
const { ValidationError } = require('../../errors');
const config = require('../../config');

const ajv = new Ajv({
  schemas: _.values(require('../../model/schemas'))
});

module.exports = {

  validateNewCalendar(req, res, next) {
    debug('validateNewCalendar');
    const validate = ajv.getSchema('http://cannabisvendormgmt.com/schemas/new-calendar.json');
    const valid = validate(req.body);

    if (!valid) {
      next(new ValidationError(validate.newCalendar, req.body));
    } else {
      next();
    }
  },

  validateNewEvent(req, res, next) {
    debug('validateNewEvent');
    const validate = ajv.getSchema('http://cannabisvendormgmt.com/schemas/new-event.json');
    const valid = validate(req.body);

    if(!valid) {
      next(new ValidationError(validate.errors, req.body));
    } else {
      next();
    }
  },

  validateNewLocation(req, res, next) {
    debug('validateNewLocation');
    var valid = validators.newLocation(req.body);

    if (!valid) {
      next(new ValidationError(validators.newLocation, req.body));
    } else {
      next();
    }
  },

  validateNewVendor(req, res, next) {
    debug('validateNewVendor');
    const validate = ajv.getSchema('http://cannabisvendormgmt.com/schemas/new-vendor.json');
    const valid = validate(req.body);

    if (!valid) {
      next(new ValidationError(validate.errors, req.body));
    } else {
      next();
    }
  },

  validateVendor(req, res, next) {
    debug('validateVendor');
    const validate = ajv.getSchema('http://cannabisvendormgmt.com/schemas/vendor.json');
    const valid = validate(req.vendor);

    if (!valid) {
      next(new ValidationError(validate.errors, req.vendor));
    } else {
      next();
    }
  }

};
