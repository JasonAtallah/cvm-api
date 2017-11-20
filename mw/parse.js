const bodyParser = require('body-parser');
const multer = require('multer');
const GridFS = require('multer-gridfs-storage');
const config = require('../config');

const gridFSStorage = GridFS({
  db: config.mongo.getDB
});

const multerUpload = multer({
  storage: gridFSStorage,
  limits: {
    fileSize: 1000000
  }
});

module.exports = {
  file: multerUpload.single('file'),
  form: bodyParser.urlencoded({ extended: true }),
  json: bodyParser.json()
};
