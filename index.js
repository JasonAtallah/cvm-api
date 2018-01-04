'use strict';

const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const config = require('./config');
const errors = require('./mw/errors');

dotenv.load();
config.load();

const app = express();

app.use(morgan('combined'));
app.use(require('./routes/auth/router')(app));
app.use(require('./routes/buyer/router')(app));
app.use(require('./routes/vendor/router')(app));
app.use(errors.status404);
app.use(errors.serverError);

var server = app.listen(config.app.port, function () {
  console.log(`App is running on port ${config.app.port}`);
});
