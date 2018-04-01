import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import getReducer from './getReducer';
import getRoutes from './getRoutes';
import getSaga from './getSaga';
import getStore from './getStore';
import { noop } from './utils';

function Kar98k() {
  this.modules = {};
  this.middlewares = [];
}

export default (...args) => new Kar98k(...args);
export { connect };

Kar98k.prototype.module = function(module) {
  const { namespace } = module;
  if(!namespace) throw new Error('namespace required');
  if(namespace in Object.keys(this.modules)) throw new Error('duplicate namespace');
  this.modules[namespace] = Object.assign({}, defaultModule, module);
};

Kar98k.prototype.use = function(...middleware) {
  this.middlewares.push(...middleware);
};

Kar98k.prototype.start = function(id) {
  const reducer = getReducer(this.modules);
  const routes = getRoutes(this.modules);
  const saga = getSaga(this.modules);
  const store = getStore(reducer, this.middlewares);
  store.runSaga(saga);
  ReactDOM.render(  
    <Provider store={store}>
      {routes}
    </Provider>,
    document.querySelector(id),
  );
};

const defaultModule = {
  state    : {},
  reducers : {},
  effects  : {},
  routes   : {},
  catch    : noop,
};
