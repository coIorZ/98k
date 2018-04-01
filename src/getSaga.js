import * as sagaEffects from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { prefixType } from './utils.js';

export default modules => {
  let sagas = [];
  Object.keys(modules).forEach(namespace => {
    const { effects, catch: onCatch } = modules[namespace];
    const effectSagas = Object.keys(effects).map(type => {
      const saga = function* (...args) {
        try {
          yield effects[type](...args.concat(sagaEffects, sagaHelper));
        } catch(err) {
          onCatch({ err, type: prefixType(type, namespace) });
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
