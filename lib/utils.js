const _ = require('lodash');

module.exports = {
  replaceVars(str, values) {
    return str.replace(/\{\{([\w\_\.]+)\}\}/g, (match, group1, offset, orig) => {
      return _.get(values, group1);
    });
  }
};