import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { I18nextProvider } from "react-i18next";

import i18n from "./i18n/initI18n";
import Router from "./routing/Router";

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <Container fluid="xl" className="mb-3 mt-3">
      <Router />
    </Container>
  </I18nextProvider>,
  document.getElementById("react"),
);
