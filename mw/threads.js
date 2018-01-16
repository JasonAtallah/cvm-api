const threads = require('../lib/threads');

module.exports = {

  createBuyerAction(req, res, next) {
    req.action = threads.createAction(req.params.action, req);
    next();
  },

  createVendorAction(req, res, next) {
    req.action = threads.createAction(req.params.action, req);
    next();
  },

  loadCurrentState(req, res, next) {
    req.curState = threads.loadState(req.thread);
    next();
  },

  performActionFollowup(req, res, next) {
    try {
      const actionMW = require(`./threads/actions/followup/${req.action.name}`);
      actionMW(req, res, next);
    } catch (err) {
      next();
    }
  },

  performActionValidation(req, res, next) {
    try {
      const actionMW = require(`./threads/actions/validation/${req.action.name}`);
      actionMW(req, res, next);
    } catch (err) {
      next();
    }
  },

  transitionThreadState(req, res, next) {
    req.prevState = req.curState;
    req.state = threads.transition(req.prevState, req.action);
    console.dir(req.prevState);
    console.dir(req.state);
    req.stateChanged = (req.state.name !== req.prevState.name);
    console.dir(req.stateChanged);
    next();
  },

}
