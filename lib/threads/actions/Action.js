
module.exports = class Action {

  constructor() {
    this.data = {};
    this.data.name = this.constructor.name.replace('Action', '');
    this.data.timestamp = (new Date()).toJSON();
  }

  get name() {
    return this.data.name;
  }

  toObject() {
    return this.data;
  }

  perform(req, res, next) {
    next();
  }
}
