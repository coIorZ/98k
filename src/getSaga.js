import * as sagaEffects from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { prefixType } from './utils.js';

export default (modules, cbEffects) => {
  let sagas = [];

  Object.keys(modules).forEach(namespace => {
    const module = modules[namespace];
    const { effects, catch: onCatch } = module;
    const effectSagas = Object.keys(effects).map(type => {
      const preType = prefixType(type, namespace);
      let saga = function* (action) {
        try {
          yield effects[type](action, sagaEffects, sagaHelper);
        } catch(err) {
          let error = err;
          if(!(error instanceof Error)) {
            error = new Error(error);
          }
          yield onCatch(error, action, sagaEffects, sagaHelper);
        }
      };
      saga = applyCb(cbEffects, saga, module, preType);
      const watcher = function* () {
        yield sagaEffects.takeLatest(preType, saga);
      };
      return watcher();
    });
    sagas = [...sagas, ...effectSagas];
  });

  return function* () {
    yield sagaEffects.all(sagas);
  };
};

const applyCb = (fns, saga, module, type) => {
  for(const fn of fns) {
    saga = fn(saga, module, type, sagaEffects, sagaHelper);
  }
  return saga;
};

const sagaHelper = {
  delay,
};
