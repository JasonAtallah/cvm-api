'use strict';

const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');

dotenv.load();
config.load();

const app = express();
app.use(morgan('combined'));

require('./routes/auth')(app);
app.use('/vendor/v1', require('./routes/vendor-router-v1')(app));
app.use('/buyer/v1', require('./routes/buyer-router-v1')(app));

app.use(function (req, res, next) {
  if (!res._headerSent) {
    console.log(req.path + ' not found');
    res.status(404).send('File not found.');
  }
});

app.use(function (err, req, res, next) {
  console.log('error: ' + err.message);
  console.dir(err);
  if (err.status) {
    err.statusCode = err.status;
  }
  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).send(err.message);
  }
});

var server = app.listen(config.app.port, function () {
  console.log(`App is running on port ${config.app.port}`);
});
