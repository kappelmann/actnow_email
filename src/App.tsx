import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import RouteFormMepContact from "./routes/RouteFormMepContact";
import RouteFormWrite from "./routes/RouteFormWrite";
import Urls from "./consts/urls";

export const App = () => {
  return (
    <Router>
      <Switch>
        <Route path={Urls.Mailto}>
          <RouteFormWrite />
        </Route>
        <Route path={Urls.Meps}>
          <RouteFormMepContact />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
