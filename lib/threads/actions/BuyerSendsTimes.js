const Action = require('./Action');

module.exports = class BuyerSendsTimesAction extends Action {

  constructor(req) {
    super();
    this.data.suggestedTimes = req.body.suggestedTimes;
  }

};
