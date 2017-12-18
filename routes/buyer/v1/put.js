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

  router.put('/emails/:templateId',
    auth.isLoggedIn,
    parse.json,
    mongo.updateBuyerEmailTemplate,
    responses.sendOk(200));

  router.put('/gcalendar',
    auth.isLoggedIn,
    parse.json,
    gcalendar.prepCalendar,
    mongo.updateCalendar,
    responses.sendOk(201));

  router.put('/schedule',
    auth.isLoggedIn,
    parse.json,
    mongo.updateBuyerSchedule,
    responses.sendOk(204));

  router.put('/vendors/:vendorId/approve',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    mongo.approveVendor,
    gmail.sendApprovalEmailToVendor,
    responses.sendReqVar('vendor'));

  router.put('/vendors/:vendorId/reject',
    auth.isLoggedIn,
    mongo.prepBuyerQueryFromAuth,
    mongo.getBuyer,
    parse.json,
    mongo.rejectVendor,
    gmail.sendRejectionEmailToVendor,
    // mongo.storeResult store result from rejection with datetime in vendor
    responses.sendReqVar('vendor'));

  return router;
};
