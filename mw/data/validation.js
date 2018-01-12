const _ = require('lodash');
const Ajv = require('ajv');
const debug = require('debug')('cvm-api.mw.data.validation');
const { ValidationError } = require('../../errors');
const config = require('../../config');

const ajv = new Ajv({
  schemas: _.values(require('../../model/schemas'))
});

module.exports = {

  validateReqVar(reqVarName, schemaName) {
    return (req, res, next) => {
      debug(`validate req[${reqVarName}] with ${schemaName}`);
      const schemaPath = `http://cannabisvendormgmt.com/schemas/${schemaName}.json`;
      const validate = ajv.getSchema(schemaPath);
      const data = _.get(req, reqVarName);
      const valid = validate(data);

      if (!valid) {
        next(new ValidationError(validate.errors, data));
      } else {
        next();
      }
    };
  }

};
