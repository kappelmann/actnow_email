import React from "react";
import styled from "styled-components";
import BootstrapForm from "react-bootstrap/Form";
import {
  FieldInputProps,
  useField
} from "formik";

import Label from "../components/Label";

export type FieldCheckboxPropsBase = {
  indeterminate?: boolean
} & ({
  ariaLabel?: string,
  label: string,
  tooltip?: string
} | {
  ariaLabel: string,
  label?: string,
  tooltip?: string
});

export type FieldCheckboxProps = FieldCheckboxPropsBase & Omit<FieldInputProps<boolean>, "onChange"> & {
  className?: string,
  onChange: (checked : boolean) => any;
};

export const FieldCheckbox = ({
  className,
  value,
  onChange,
  indeterminate = false,
  ariaLabel,
  name,
  label,
  tooltip,
  ...rest
} : FieldCheckboxProps) => {
  const checkbox = React.useRef<HTMLInputElement>(null);
  if (checkbox.current)
    checkbox.current.indeterminate = indeterminate;

  return (
    <BootstrapForm.Check
      className={className}
      type="checkbox"
      checked={value}
      ref={checkbox}
      // can safely cast here as either ariaLabel or label must exist
      aria-label={ariaLabel ?? label}
      label={label &&
        <Label
          controlId={name}
          label={label}
          tooltip={tooltip}
        />
      }
      id={name}
      name={name}
      onChange={({ target } : React.ChangeEvent<HTMLInputElement>) => onChange(target.checked)}
      {...rest}
    />
  );
};

export const StyledFieldCheckbox = styled(FieldCheckbox)`
  & label {
    cursor: pointer;
  }
`;


export type ConnectedFieldCheckboxProps = FieldCheckboxPropsBase & {
  name: string
};

export const ConnectedFieldCheckbox = ({
  name,
  ...rest
} : ConnectedFieldCheckboxProps) => {
  const [field, , { setValue }] = useField({ name });
  return (
    <StyledFieldCheckbox
      {...field}
      onChange={setValue}
      {...rest}
    />
  );
};

export default ConnectedFieldCheckbox;
