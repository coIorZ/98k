import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import getReducer from './getReducer';
import getRoutes from './getRoutes';
import getSaga from './getSaga';
import getStore from './getStore';
import { noop } from './utils';

function Kar98k(opts) {
  this.opts = Object.assign(defaultOpts, opts);
  this.modules = {};
  this.middlewares = [];
  this.reducers = {};
  this.effects = [];
}

export default (...args) => new Kar98k(...args);
export { connect };

Kar98k.prototype.module = function(module) {
  const { namespace } = module;
  if(!namespace) throw new Error('namespace required');
  if(namespace in Object.keys(this.modules)) throw new Error('duplicate namespace');
  this.modules[namespace] = Object.assign({}, defaultModule, module);
  return this;
};

Kar98k.prototype.middleware = function(...middleware) {
  this.middlewares.push(...middleware);
  return this;
};

Kar98k.prototype.use = function(fn) {
  fn(reducer => {
    this.reducers = Object.assign(this.reducers, reducer);
  }, fn => {
    this.effects.push(fn);
  });
  return this;
};

Kar98k.prototype.start = function(id) {
  const reducer = getReducer(this.modules, this.reducers);
  const routes = getRoutes(this.modules, this.opts);
  const saga = getSaga(this.modules, this.effects);
  const store = getStore(reducer, this.middlewares);
  store.runSaga(saga);
  ReactDOM.render(  
    <Provider store={store}>
      {routes}
    </Provider>,
    document.querySelector(id),
  );
};

const defaultOpts = {
  router   : 'browser',
  basename : '/',
};

const defaultModule = {
  state    : {},
  reducers : {},
  effects  : {},
  routes   : {},
  catch    : noop,
};
