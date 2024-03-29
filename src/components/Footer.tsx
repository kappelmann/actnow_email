import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons/faGithub";
import { faGlobe } from "@fortawesome/free-solid-svg-icons/faGlobe";

import { useLocation } from "react-router";

import ReactCountryFlag from "react-country-flag";
import { LANGUAGES_TO_COUNTRIES } from "../i18n/consts";

import URLS from "../consts/urls";
import { PATHS } from "../routing/Router";

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const [error, setError] = useState<Error>();

  // TODO: temporarily hard-coded
  const isOnMepSite = pathname.includes("meps");

  const changeLanguage = (lng : string) => (
    i18n.changeLanguage(lng, (err) => setError(err))
  );

  return (
    <footer>
      <Row className="mt-3 text-center">
        <Col xs={12} md className="text-md-left">
          {error && <Alert variant={"danger"}>{error.toString()}</Alert>}
          {`${t("Change language")} `}
          {Object.keys(LANGUAGES_TO_COUNTRIES).map((lng, key) => (
            <Button key={key} className="m-0 p-0 bg-transparent" variant="light" onClick={() => changeLanguage(lng)}>
              <ReactCountryFlag countryCode={LANGUAGES_TO_COUNTRIES[lng]}/>{" "}
            </Button>
          ))}
        </Col>
        <Col xs={12} md className="text-md-right">
          {!isOnMepSite &&
            <>
              <ReactCountryFlag countryCode="EU"/>{" "}
              <Link to={{ pathname: PATHS.MEPS }} target="_blank">{t("Did you try our European parliament contact tool?")}</Link>{" "}
              <ReactCountryFlag countryCode="EU"/>
            </>
          }
          {isOnMepSite &&
            <Link to={{ pathname: PATHS.MAILTO }} target="_blank">{t("Did you try our general-purpose contact tool?")}</Link>
          }
        </Col>
      </Row>
      <Row className="mt-3 text-center">
        <Col xs={12} md className="text-md-left">
          {`${t("An initiative of the")} `}
          <Link to={{ pathname: URLS.KLIMA_CAFE }} target="_blank">klima.cafe</Link>{" "}
          <FontAwesomeIcon icon={faGlobe} fixedWidth />
        </Col>
        <Col xs={12} md className="text-md-right">
          {`${t("This website is open-source and available on")} `}
          <Link to={{ pathname: URLS.GITHUB }} target="_blank">GitHub</Link>{" "}
          <FontAwesomeIcon icon={faGithub} fixedWidth />
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
