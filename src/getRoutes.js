import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export default modules => {
  let ret = {};
  Object.keys(modules).forEach(namespace => {
    const { routes } = modules[namespace];
    ret = Object.assign(ret, routes);
  });
  return (
    <BrowserRouter>
      <Switch>
        {Object.keys(ret).map(path => {
          const { exact = true, component } = ret[path];
          return <Route path={path} exact={exact} component={component}/>;
        })}
      </Switch>
    </BrowserRouter>
  );
};
