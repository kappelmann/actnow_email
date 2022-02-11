import React, {
  useState
} from "react";
import Jumbotron from "react-bootstrap/Jumbotron";

import Button from "react-bootstrap/Button";
import Fade from "react-bootstrap/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons/faTimes";

export type ExplanationJumbotronProps = {
  closable?: boolean,
  heading: React.ReactNode;
  body: React.ReactNode;
}

export const ExplanationJumbotron = ({
  closable = false,
  heading,
  body
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
        {heading}
        {body}
      </Jumbotron>
    </Fade>
  );
};

export default ExplanationJumbotron;
