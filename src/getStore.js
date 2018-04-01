import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default (reducer, middlewares) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(reducer, composeEnhancers(
    applyMiddleware(...[...middlewares, sagaMiddleware])),
  );
  store.runSaga = sagaMiddleware.run;
  return store;
};
