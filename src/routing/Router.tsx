import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import RouteFormMepContact from "./routes/RouteFormMepContact";
import RouteFormWrite from "./routes/RouteFormWrite";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import URLS from "../consts/urls";

export const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route path={"/germany/munich/"}>
          <RouteFormWrite />
        </Route>
        <Route path={`/${URLS.MAILTO}/${URLS.MEPS}`}>
          <RouteFormWrite backUrl={`/${URLS.MEPS}`} />
        </Route>
        <Route path={`/${URLS.MEPS}`}>
          <RouteFormMepContact />
        </Route>
        <Route path={`/${URLS.MAILTO}`}>
          <RouteFormWrite />
        </Route>
        <Route path={"/"}>
          <RouteFormWrite />
        </Route>
      </Switch>
      <hr/>
      <Footer />
    </Router>
  );
};

export default App;
