import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGithub
} from "@fortawesome/free-brands-svg-icons";

import URLS from "../consts/urls";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer>
      <Row className="mt-3 text-center">
        <Col xs={12} md className="text-md-left">
          {`${t("An initiative of the")} `}
          <Link to={{ pathname: URLS.TWITTER }} target="_blank">klima.cafe</Link>
          <FontAwesomeIcon icon={faTwitter} fixedWidth />
        </Col>
        <Col xs={12} md className="text-md-right">
          {`${t("This website is open-source and available on")} `}
          <Link to={{ pathname: URLS.GITHUB }} target="_blank">GitHub</Link>
          <FontAwesomeIcon icon={faGithub} fixedWidth />
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
