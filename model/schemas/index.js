const _ = require('lodash');
const requireDirectory = require('require-directory');
const traverse = require('traverse');

const requireDirectoryOptions = {
  exclude: /threads\/actions\//
};

const flattenSchemaBranch = ([branchName, schemaDefs]) => {
  const schemas = _.toPairs(schemaDefs);
  return schemas.map(([fileName, def]) => {
    return Object.assign(def, {
      $id: `http://cannabisvendormgmt.com/${branchName}/${fileName}`
    })
  });
};

const schemaTree = requireDirectory(module, requireDirectoryOptions);
const schemaList = _.flatten(_.toPairs(schemaTree).map(flattenSchemaBranch))

module.exports = schemaList;
