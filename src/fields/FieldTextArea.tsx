import React from "react";
import BootstrapForm from "react-bootstrap/Form";
import {
  FieldInputProps,
  useField
} from "formik";

import {
  Label,
  LabelProps
} from "../components/Label";

export type FieldTextAreaPropsBase = {
  placeholder?: string,
  rows: number
};

export type FieldTextAreaProps = FieldTextAreaPropsBase & Omit<FieldInputProps<string>, "onChange"> & {
  onChange: (value : string) => any;
};

export const FieldTextArea = ({
  onChange,
  ...rest
} : FieldTextAreaProps) => (
  <BootstrapForm.Control
    as="textarea"
    onChange={({ target }) => onChange(target.value)}
    {...rest}
  />
);

export type ConnectedFieldTextAreaProps = FieldTextAreaPropsBase & {
  name: string
};

export const ConnectedFieldTextArea = ({
  name,
  ...rest
} : ConnectedFieldTextAreaProps) => {
  const [field, , { setValue }] = useField({ name });
  return (
    <FieldTextArea
      {...field}
      onChange={setValue}
      {...rest}
    />
  );
};

export type ConnectedFieldTextAreaWithLabelProps = ConnectedFieldTextAreaProps
  & LabelProps;

export const ConnectedFieldTextAreaWithLabel = ({
  controlId,
  label,
  tooltip,
  ...rest
}: ConnectedFieldTextAreaWithLabelProps) => (
  <BootstrapForm.Group controlId={controlId}>
    <Label label={label} controlId={controlId} tooltip={tooltip}/>
    <ConnectedFieldTextArea {...rest} />
  </BootstrapForm.Group>
);

export default ConnectedFieldTextAreaWithLabel;
