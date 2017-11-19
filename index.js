'use strict';

const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const config = require('./config');

dotenv.load();
config.load();

const app = express();

app.use(cors({
  optionsSuccessStatus: 200,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: true,
  maxAge: 3600,
  origin: function (origin, callback) {
    if (config.cors.whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS: ${origin}`));
    }
  }
}));

require('./mw/api')(app);

app.use(function (req, res, next) {
  console.log(req.path + ' not found');
  res.status(404).send('File not found.');
});

app.use(function (err, req, res, next) {
  console.log('error: ' + err.message);
  if (err.status) {
    err.statusCode = err.status;
  }
  if (err.statusCode) {
    res.status(err.statusCode).send(err.message);
  } else {
    res.status(500).send(err.message);
  }
});

var server = app.listen(config.port, function () {
  console.log(`App is running on port ${config.port}`);
});
