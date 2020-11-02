import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusSquare,
  faPlusSquare
} from "@fortawesome/free-solid-svg-icons";

export type ExpandButtonProps= {
  initialValue?: boolean,
  onClick?: (isOpen : boolean) => any,
  label?: string,
  className?: string
};

export const ExpandButton = ({
  initialValue = false,
  onClick = () => {},
  label = "",
  className = ""
} : ExpandButtonProps) => {
  const [isOpen, setIsOpen] = useState(initialValue);

  return (
    <Button
      block
      variant="secondary"
      onClick={() => {
        setIsOpen(!isOpen);
        onClick(!isOpen);
      }}
      className={className}
      aria-expanded={isOpen}
    >
      <FontAwesomeIcon icon={isOpen ? faMinusSquare : faPlusSquare} fixedWidth />
      {` ${label}`}
    </Button>
  );
};

export default ExpandButton;
