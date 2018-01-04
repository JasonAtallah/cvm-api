const traverse = require('traverse');
const config = require('../../config');

module.exports = {

  locateFileInVendor(req, res, next) {
    traverse(req.vendor).forEach(function (elem) {
      if (elem && elem.id === req.params.fileId) {
        req.file = elem;
      }
    });
    next();
  }

};
