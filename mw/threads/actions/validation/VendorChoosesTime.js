const debug = require('debug')('cvm-api.mw.threads.actions.validation');
const _ = require('lodash');
const mw = require('../../../../mw');

module.exports = mw.compose([  
  mw.data.validation.validateReqVar('body', 'vendor-choosesTime'),
  (req, res, next) => {
    const suggestedTimeMatches = _.some(req.curState.data.suggestedTimes, (time) => {
      return _.isEqual(time, req.action.data.selectedTime);
    });
    
    const rejectedTimeMatches = _.some(req.curState.data.rejectedTimes, (time) => {
      return _.isEqual(time, req.action.data.selectedTime);
    });
    
    if (!suggestedTimeMatches) {
      debug('cur state:', JSON.stringify(req.curState.data));
      debug('selected time:', JSON.stringify(req.action.data.selectedTime));

      const err = new Error('Selected time is not an available time.');
      err.status = 400;
      next(err);
    } else if (rejectedTimeMatches) {
      debug('cur state:', JSON.stringify(req.curState.data));
      debug('selected time:', JSON.stringify(req.action.data.selectedTime));
      
      const err = new Error('Selected time is a rejected time.');
      err.status = 400;
      next(err);
    } else {
      next();
    }
  }
]);
