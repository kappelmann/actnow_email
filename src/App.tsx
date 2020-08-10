import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import RouteFormMepContact from "./routes/RouteFormMepContact";
import RouteFormWrite from "./routes/RouteFormWrite";
import URLS from "./consts/urls";

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route path={URLS.MAILTO}>
          <RouteFormWrite />
        </Route>
        <Route path={URLS.MEPS}>
          <RouteFormMepContact />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
