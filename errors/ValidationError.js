const debug = require('debug')('cvm-api.errors.ValidationError');

module.exports = class ValidationError extends Error {
  constructor(validation, data) {
    const error = validation.errors[0];
    const message = `${error.dataPath.replace('.', ' ').trim()} ${error.message}`;

    super(message);

    debug(`validation error: ${message}`);
    debug(data);

    this.status = 400;
  }
}
