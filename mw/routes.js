const express = require('express');
const jwtAuthz = require('express-jwt-authz');
const request = require('request-promise');
const config = require('../config');
const auth0 = require('./auth0');
const gcalendar = require('./gcalendar');
const mongo = require('./mongo');

module.exports = function (app) {
  const isBuyer = jwtAuthz(['buyer']);
  const router = express.Router();

  function sendReqVar (name) {
    return (req, res) => {
      res.status(200).send(req[name]);
    };
  }

  function sendOk () {
    return (req, res) => {
      res.status(202).send({
        status: 'OK'
      });
    };
  }

  router.get('/buyer',
    /*isBuyer,*/
    mongo.getBuyer,
    mongo.cleanBuyer,
    sendReqVar('buyer'));

  router.put('/buyer/gcalendar',
    /*isBuyer,*/
    auth0.getMgr,
    auth0.getUser,
    gcalendar.prepCalendar,
    mongo.updateCalendar,
    sendOk());

  router.get('/calendars',
    /*isBuyer,*/
    auth0.getMgr,
    auth0.getUser,
    gcalendar.getCalendarList,
    gcalendar.mapCalendarList,
    sendReqVar('calendars'));

  router.post('/calendar',
    /*isBuyer,*/
    auth0.getMgr,
    auth0.getUser,
    gcalendar.createCalendar,
    gcalendar.mapCalendar,
    sendReqVar('calendar'));

  router.get('/events',
    /*isBuyer,*/
    auth0.getMgr,
    auth0.getUser,
    mongo.getBuyer,
    gcalendar.getCalendarEvents,
    sendReqVar('events'));

  router.post('/events',
    /*isBuyer,*/
    auth0.getMgr,
    auth0.getUser,
    mongo.getBuyer,
    gcalendar.prepCalendarEvent,
    gcalendar.createCalendarEvent,
    gcalendar.mapCalendarEvent,
    sendReqVar('event'));

  router.get('/vendors',
    /*isBuyer,*/
    mongo.getVendors,
    sendReqVar('vendors'));

  router.post('/vendors',
    /*isBuyer,*/
    mongo.createVendor,
    sendReqVar('vendor'));

  router.put('/vendors/:vendorId/approve',
    /*isBuyer,*/
    mongo.approveVendor,
    sendReqVar('vendor')
    /* TODO: send email... */);

  router.put('/vendors/:vendorId/reject',
    /*isBuyer,*/
    mongo.rejectVendor,
    sendReqVar('vendor')
    /* TODO: send email... */);

  app.use('/api', router);

  app.use(function (req, res, next) {
    console.log(req.path + ' not found');
    res.status(404).send('File not found.');
  });

  app.use(function (err, req, res, next) {
    console.log('error: ' + err.message);
    res.status(500).send(err.message);
  });
};
