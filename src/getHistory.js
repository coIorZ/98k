import createBrowserHistory from "history/createBrowserHistory";
import createHashHistory from "history/createHashHistory";

export default opts => {
  const { router, basename } = opts;
  let history;
  if(router === 'browser') {
    history = createBrowserHistory({ basename });
  } else if(router === 'hash') {
    history = createHashHistory({ basename });
  }
  return history;
};
