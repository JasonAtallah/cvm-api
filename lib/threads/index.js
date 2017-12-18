const states = require('./states');

module.exports = {

  createState(name) {
    if (!states[name]) {
      throw new Error(`Invalid state requested: ${name}`);
    }

    const State = states[name];
    return new State().toObject();
  },

  transition(thread, action) {
    if (!thread.state) {
      throw new Error(`Invalid thread state: null`);
    }

    if (!states[thread.state.name]) {
      throw new Error(`Invalid thread state: ${thread.state.name}`);
    }

    const CurState = states[thread.state.name];
    const curState = new CurState(thread.state);
    const newState = curState.transition(action);

    return newState.toObject();
  }

};
