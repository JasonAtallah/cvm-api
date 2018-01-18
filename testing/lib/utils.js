const _ = require('lodash');
const traverse = require('traverse');

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

  traverseVars(data, values) {
    traverse(data).forEach(function(node) {
      if (this.isLeaf) {
        let matches = /\{\{([\w\_\.]+)\}\}/.exec(node); // {{vendor.name.city}}
        if (matches) {
          let varName = matches[1];
          let value = _.get(values, varName);
          this.update(value);
        }
      }
    });
  }
};
