import React from "react";
import BootstrapForm from "react-bootstrap/Form";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-solid-svg-icons/faLightbulb";


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
      overlay={<Tooltip id={`tooltip-${controlId}`}>{tooltip}</Tooltip>}
    >
      <span>
        <BootstrapForm.Label>{label}</BootstrapForm.Label>{" "}
        <FontAwesomeIcon icon={faLightbulb}/>
      </span>
    </OverlayTrigger>
  );
};

export default Label;
