const _ = require('lodash');

module.exports = new class Utils
{
  replaceVars(str, values) {
    return str.replace(/\{\{([\w\_\.]+)\}\}/g, (match, group1, offset, orig) => {
      return _.get(values, group1);
    });
  }

  hasReplaceVars(str) {
    return str.indexOf('{{') >= 0 && str.indexOf('}}') >= 0;
  }
};
