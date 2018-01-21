const _ = require('lodash');
const values = require('./data.json');

module.exports = _.cloneDeep(values);
module.exports.get = (path, override) => {
  let data = _.cloneDeep(values);
  let value = _.get(data, path);
  if (override && typeof value === 'object') {
    Object.keys(override).forEach((key) => {
      _.set(value, key, override[key]);
    });
  }
  return value;
};