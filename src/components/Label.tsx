import React from "react";
import BootstrapForm from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons/faCircleQuestion";


export type LabelProps = {
  controlId: string,
  label: string,
  tooltip?: string
};

export const Label = ({
  controlId,
  label,
  tooltip
} : LabelProps) => {
  if (!tooltip)
    return <BootstrapForm.Label>{label}</BootstrapForm.Label>;

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={`${controlId}-tooltip`}>{tooltip}</Tooltip>}
    >
      <span>
        <BootstrapForm.Label>{label}</BootstrapForm.Label>{" "}
        <FontAwesomeIcon icon={faCircleQuestion}/>
      </span>
    </OverlayTrigger>
  );
};

export default Label;
