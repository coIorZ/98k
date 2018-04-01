# Kar98k
a lightweight wrapper based on react, redux, redux-saga and react-router-dom, that aims to free you from tedious steps of creating action creators, reducers, sagas etc(inspired by dva).

## Install
```sh
$ npm install --save 98k
```

## Quick start
`index.js`
```javascript
import Kar98k from '98k';
import counter from './counter';

const app = Kar98k();
//app.use(middlewares);

app.module(counter);

app.start('#app');
```

`counter.js`
```javascript
import React from 'react';
import { connect } from '98k';

const Counter = connect(state => state.counter)(({ dispatch, count }) => (
  <div>
    <div>count: {count}</div>
    <button onClick={() => dispatch({
      type    : 'counter/add',
      payload : 1,
    })}>add</button>
  </div>
));

export default {
  namespace : 'counter',
  state     : {
    count: 0,
  },
  reducers: {
    add(state, { payload }) {
      return { ...state, count: state.count + payload };
    },
  },
  routes: {
    '/': { component: Counter },
  },
};
```
actionType is the key properties of `reducers` prefixed by `namespace`.

## Asynchronous action
```javascript
const Counter = connect(state => state.counter)(({ dispatch, count }) => (
  <div>
    <div>count: {count}</div>
    <button onClick={() => dispatch({
      type    : 'counter/asyncAdd',
      payload : 2,
    })}>asyncAdd</button>
  </div>
));

export default {
  namespace : 'counter',
  state     : {
    count: 0,
  },
  effects: {
    *asyncAdd({ payload }, { put, call }, { delay }) {
      yield call(delay, 1000);
      yield put({ type: 'counter/add', payload });
    },
  },
  reducers: {
    add(state, { payload }) {
      return { ...state, count: state.count + payload };
    },
  },
  routes: {
    '/': { component: Counter },
  },
};
```

## Routing
```javascript
const App = connect(state => state.example)(({ match: { params: { id } } }) => (
  <div>routing example: {id}</div>
));

export default {
  namespace : 'example',
  routes    : {
    '/example/:id': { component: App },
  },
};
```

## Error handling
```javascript
export default {
  namespace : 'counter',
  state     : {
    count: 0,
  },
  effects: {
    *asyncAdd({ payload }, { put, call }, { delay }) {
      yield call(delay, 1000);
      throw 'some error';
      yield put({ type: 'counter/add', payload });
    },
  },
  catch: function*(err, action, { put }) {
    console.log(err);
    console.log(action);
    yield put({ type: 'counter/add', payload });
  },
  reducers: {
    add(state, { payload }) {
      return { ...state, count: state.count + payload };
    },
  },
  routes: {
    '/': { component: Counter },
  },
};
```
