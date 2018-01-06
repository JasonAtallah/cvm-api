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

  performActionFollowup(req, res, next) {
    try {
      const actionMW = require(`./threads/actions/${req.action.name}`);
      actionMW(req, res, next);
    } catch (err) {
      console.dir(err);
      next();
    }
  },

  transitionThreadState(req, res, next) {
    const result = threads.transition(req.thread, req.action);
    req.prevState = result.oldState;
    req.state = result.newState;
    req.stateChanged = (result.newState !== result.oldState);
    next();
  },

}
