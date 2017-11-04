const express = require('express');
const jwtAuthz = require('express-jwt-authz');
const request = require('request-promise');
const config = require('../config');
const auth0 = require('./auth0');
const gcalendar = require('./gcalendar');

module.exports = function(app)
{
  const router = express.Router();
  const isBuyer = jwtAuthz(['buyer']);

  function sendReqVar(name) {
    return (req, res) => {
      res.send(req[name]);
    };
  }

  router.get('/vendors', /*isBuyer,*/ function(req, res)
  {
    config.mongo.getDB.then(function(db)
    {
      db.collection('vendors').find(
      {
        ownerId: req.user.id,
        vendorId: req.query.vendorId
      }).toArray(function(err, vendors)
      {
        res.status(200).send(vendors);
      });
    });
  });

  router.get('/events', /*isBuyer,*/ function(req, res)
  {
    config.mongo.getDB.then(function(db)
    {
      db.collection('events').find(
      {}).toArray(function(err, events)
      {
        res.status(200).send(events);
      });
    });
  });

  router.put('/vendors/:vendorId/reject', /*isBuyer,*/ function(req, res)
  {
    config.mongo.getDB.then(function(db)
    {
      db.collection('vendors').update(
      {
        ownerId: req.user.id,
        vendorId: req.body.vendorId
      },
      {
        $set:
        {
          isRejected: true
        }
      }).toArray(function(err, result)
      {
        res.status(202).send('OK');
      });
    });

    // TODO: send email...
  });

  router.get('/gcalendarlist',
    /*isBuyer,*/
    auth0.getMgr,
    auth0.getUser,
    gcalendar.getCalendarList,
    gcalendar.mapCalendarList,
    sendReqVar('calendarlist'));

  app.use('/api', router);
}
