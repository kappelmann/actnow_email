import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import RouteFormMepContact from "./routes/RouteFormMepContact";
import RouteFormWrite from "./routes/RouteFormWrite";
import Footer from "./components/Footer";
import URLS from "./consts/urls";

export const App = () => {
  return (
    <Router>
      <>
        <Switch>
          <Route path={URLS.MAILTO}>
            <RouteFormWrite />
          </Route>
          <Route path={URLS.MEPS}>
            <RouteFormMepContact />
          </Route>
        </Switch>
        <Footer />
      </>
    </Router>
  );
};

export default App;
