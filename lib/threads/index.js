const states = require('./states');
const actions = require('./actions');

module.exports = {

  createState(name) {
    if (!states[name]) {
      throw new Error(`Invalid state requested: ${name}`);
    }

    const State = states[name];
    return new State();
  },

  createAction(name, req) {
    if (!actions[name]) {
      throw new Error(`Invalid action requested: ${name}`);
    }

    const Action = actions[name];
    return new Action(req);
  },

  loadState(thread) {
    if (!thread.state) {
      throw new Error(`Invalid thread state: null`);
    }

    if (!states[thread.state.name]) {
      throw new Error(`Invalid thread state: ${thread.state.name}`);
    }

    const State = states[thread.state.name];
    const state = new State(thread.state);

    return state;
  },

  transition(curState, action) {
    return curState.transition(action);
  }

};
