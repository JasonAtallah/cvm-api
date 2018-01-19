const _ = require('lodash');
const Ajv = require('ajv');
const debug = require('debug')('cvm-api.mw.data.validation');
const config = require('../../config');
const { ValidationError } = require('../../errors');
const utils = require('../../lib/utils');

const ajv = new Ajv({
  schemas: _.values(require('../../model/schemas'))
});

module.exports = {

  validateReqVar(reqVarName, schemaName) {
    return (req, res, next) => {
      const reqSchemaName = utils.replaceVars(schemaName, req);
      debug(`validate req[${reqVarName}] with ${reqSchemaName}`);
      const schemaPath = `http://cannabisvendormgmt.com/schemas/${reqSchemaName}.json`;
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
