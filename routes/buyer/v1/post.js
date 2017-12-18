const express = require('express');
const root = '../../../';
const config = require(`${root}config`);
const auth = require(`${root}mw/auth`);
const gcalendar = require(`${root}mw/gcalendar`);
const gmail = require(`${root}mw/gmail`);
const logic = require(`${root}mw/logic`);
const mongo = require(`${root}mw/mongo`);
const parse = require(`${root}mw/parse`);
const responses = require(`${root}mw/responses`);
const sendGrid = require(`${root}mw/sendGrid`);

module.exports = function (app) {

  const router = express.Router();

  router.post('/events',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    gcalendar.prepCalendarEventForInsert,
    gcalendar.createCalendarEvent,
    gcalendar.prepCalendarEventForResponse,
    responses.sendReqVar('event'));

  router.post('/vendors',
    auth.isLoggedIn,
    parse.json,
    mongo.prepNewVendorFromBuyer,
    mongo.validateNewVendor,
    mongo.insertVendor,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    mongo.prepNewVendorThread,
    mongo.insertThread,
    mongo.prepNewThreadForVendorResponse,
    responses.sendReqVar('vendor'));

  return router;
};
