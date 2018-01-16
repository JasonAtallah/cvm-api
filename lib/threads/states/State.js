
module.exports = class State {

  constructor(data = {}) {
    this.data = data;
    this.data.name = this.constructor.name.replace('State', '');
  }

  get name() {
    return this.data.name;
  }

  toObject() {
    return this.data;
  }

  transition(action) {
    return this;
  }
}
