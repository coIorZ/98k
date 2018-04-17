import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

export default (modules, history) => {
  let ret = {};
  Object.keys(modules).forEach(namespace => {
    const { routes } = modules[namespace];
    ret = Object.assign(ret, routes);
  });

  return (
    <Router history={history}>
      <Switch>
        {Object.keys(ret).map(path => {
          const { exact = true, component } = ret[path];
          return <Route path={path} exact={exact} component={component}/>;
        })}
      </Switch>
    </Router>
  );
};
