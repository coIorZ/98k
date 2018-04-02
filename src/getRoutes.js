import React from 'react';
import { BrowserRouter, HashRouter, Route, Switch } from 'react-router-dom';

export default (modules, opts) => {
  let ret = {};
  Object.keys(modules).forEach(namespace => {
    const { routes } = modules[namespace];
    ret = Object.assign(ret, routes);
  });

  const { router, basename } = opts;
  let Router = BrowserRouter;
  if(router === 'hash') Router = HashRouter;

  return (
    <Router basename={basename}>
      <Switch>
        {Object.keys(ret).map(path => {
          const { exact = true, component } = ret[path];
          return <Route path={path} exact={exact} component={component}/>;
        })}
      </Switch>
    </Router>
  );
};
