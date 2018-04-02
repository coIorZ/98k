import { combineReducers } from 'redux';
import { identify, prefixType } from './utils.js';

const handleAction = (actionType, handler = identify) => (state, action) => {
  const { type } = action;
  if(type && type === actionType) return handler(state, action);
  return state;
};

const handleActions = (handlers, initialState, namespace) => {
  const reducers = Object.keys(handlers).map(type => handleAction(prefixType(type, namespace), handlers[type]));
  return (state = initialState, action) => reducers.reduce((prev, r) => r(prev, action), state);
};

export default (modules, extraReducers) => {
  var ret = {};
  Object.keys(modules).forEach(namespace => {
    const { reducers, state } = modules[namespace];
    ret[namespace] = handleActions(reducers, state, namespace);
  });
  return combineReducers({ ...ret, ...extraReducers });
};
