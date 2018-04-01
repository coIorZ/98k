import * as sagaEffects from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { prefixType } from './utils.js';

export default modules => {
  let sagas = [];
  Object.keys(modules).forEach(namespace => {
    const { effects, catch: onCatch } = modules[namespace];
    const effectSagas = Object.keys(effects).map(type => {
      const saga = function* (action) {
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
      const watcher = function* () {
        yield sagaEffects.takeLatest(prefixType(type, namespace), saga);
      };
      return watcher();
    });
    sagas = [...sagas, ...effectSagas];
  });
  return function* () {
    yield sagaEffects.all(sagas);
  };
};

const sagaHelper = {
  delay,
};
