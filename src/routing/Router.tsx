import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

import { FormMepsSelectValuesMepsKeys } from "../forms/connected/FormMepsSelect";
import RouteFormMepsSelect from "./routes/RouteFormMepsSelect";
import RouteFormWrite from "./routes/RouteFormWrite";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";

import {
  SELECT_MEPS,
  SelectMepsParamsKeys
} from "../databases/meps/sqls";
import DATABASE_LOCATIONS from "../databases/databaseLocations";


export const PATHS = {
  MAILTO: "/mailto",
  MEPS: "/meps",
  MEPS_MAILTO: "/meps/mailto"
};

export const App = () => {
  const databaseMeps = {
    databaseLocation: DATABASE_LOCATIONS.MEPS,
    idRow: FormMepsSelectValuesMepsKeys.MepId,
    sql: (ids : string[]) => SELECT_MEPS({ [SelectMepsParamsKeys.MepIds]: ids })
  };

  return (
    <Router>
      <ScrollToTop />
      <Switch>
        <Route path={`${PATHS.MEPS_MAILTO}`}>
          <RouteFormWrite backUrl={PATHS.MEPS} databaseData={databaseMeps} />
        </Route>
        <Route path={PATHS.MEPS}>
          <RouteFormMepsSelect />
        </Route>
        <Route path={PATHS.MAILTO}>
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
