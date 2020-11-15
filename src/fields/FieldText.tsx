import React from "react";
import BootstrapForm from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import {
  FieldInputProps,
  useField
} from "formik";

import {
  Label,
  LabelProps
} from "../components/Label";

export type FieldTextPropsBase = {
  disabled?: boolean,
  placeholder?: string,
  inputGroupChildren?: React.ReactNode
};

export type FieldTextProps = FieldTextPropsBase & Omit<FieldInputProps<string>, "onChange"> & {
  onChange: (value : string) => any
};

export const FieldText = ({
  onChange,
  inputGroupChildren,
  ...rest
} : FieldTextProps) => (
  <InputGroup>
    <InputGroup.Prepend>
      {inputGroupChildren}
    </InputGroup.Prepend>
    <BootstrapForm.Control
      type="text"
      onChange={({ target }) => onChange(target.value)}
      {...rest}
    />
  </InputGroup>
);

export type ConnectedFieldTextProps = FieldTextPropsBase & {
  name: string
};

export const ConnectedFieldText = ({
  name,
  ...rest
} : ConnectedFieldTextProps) => {
  const [field, , { setValue }] = useField({ name });
  return (
    <FieldText
      {...field}
      onChange={setValue}
      {...rest}
    />
  );
};

export type ConnectedFieldTextWithLabelProps = ConnectedFieldTextProps
  & LabelProps;

export const ConnectedFieldTextWithLabel = ({
  controlId,
  label,
  tooltip,
  ...rest
}: ConnectedFieldTextWithLabelProps) => (
  <BootstrapForm.Group controlId={controlId}>
    <Label label={label} controlId={controlId} tooltip={tooltip}/>
    <ConnectedFieldText {...rest} />
  </BootstrapForm.Group>
);

export default ConnectedFieldTextWithLabel;
