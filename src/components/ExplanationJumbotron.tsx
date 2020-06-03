import React, {
  useState
} from "react";
import Jumbotron from "react-bootstrap/Jumbotron";

import Button from "react-bootstrap/Button";
import Fade from "react-bootstrap/Fade";
// import Collapse from "react-bootstrap/Collapse";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes
} from "@fortawesome/free-solid-svg-icons";

export type ExplanationJumbotronProps = {
  closable?: boolean,
  heading: string;
  text: string;
}

export const ExplanationJumbotron = ({
  closable = false,
  heading,
  text
} : ExplanationJumbotronProps) => {
  const [open, setOpen] = useState(true);
  return (
    <Fade in={open} unmountOnExit={true}>
      <Jumbotron>
        {closable &&
          <Button className="float-right" variant="outline-dark" onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        }
        <h1>{heading}</h1>
        <p>{text}</p>
      </Jumbotron>
    </Fade>
  );
};

export default ExplanationJumbotron;
