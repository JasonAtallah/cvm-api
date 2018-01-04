const Action = require('./Action');

module.exports = class VendorChoosesTimeAction extends Action {

  constructor(req) {
    super();
    this.data.selectedTime = req.body.selectedTime;
  }

};
