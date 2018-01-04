const ObjectID = require('mongodb').ObjectID;
const GridFSBucket = require('mongodb').GridFSBucket;
const config = require('../../config');

module.exports = {

  stream(req, res, next) {
    res.set('Content-Type', req.file.contentType);
    res.set('Content-Disposition', `attachment; filename="${req.file.originalname}"`);

    config.mongo.getDB
    .then((db) => {
      var bucket = new GridFSBucket(db,
        { bucketName: req.file.bucketName, chunkSizeBytes: req.file.chunkSize });
      var downloadStream = bucket.openDownloadStream(new ObjectID(req.file.id));
      downloadStream.on("error", function(err) {
        next(err);
      });
      downloadStream.pipe(res);
    })
    .catch((err) => {
      next(err);
    });
  }

};
