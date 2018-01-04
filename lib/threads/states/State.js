
module.exports = class State {

  constructor(data = {}) {
    this.data = data;
    this.data.name = this.constructor.name.replace('State', '');
  }

  toObject() {
    return this.data;
  }

  transition(action) {
    return this;
  }
}
