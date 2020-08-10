import React from "react";
import BootstrapForm from "react-bootstrap/Form";
import {
  FieldInputProps,
  useField
} from "formik";

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

export type ConnectedFieldTextAreaWithLabelProps = ConnectedFieldTextAreaProps & {
  controlId: string,
  label: string
};

export const ConnectedFieldTextAreaWithLabel = ({
  controlId,
  label,
  ...rest
}: ConnectedFieldTextAreaWithLabelProps) => (
  <BootstrapForm.Group controlId={controlId}>
    <BootstrapForm.Label>{label}</BootstrapForm.Label>
    <ConnectedFieldTextArea {...rest} />
  </BootstrapForm.Group>
);

export default ConnectedFieldTextAreaWithLabel;
