import React from "react";
import BootstrapForm from "react-bootstrap/Form";
import {
  FieldInputProps,
  useField
} from "formik";

export type FieldTextPropsBase = {
  placeholder?: string
};

export type FieldTextProps = FieldTextPropsBase & Omit<FieldInputProps<string>, "onChange"> & {
  onChange: (value : string) => any;
};

export const FieldText = ({
  onChange,
  ...rest
} : FieldTextProps) => (
  <BootstrapForm.Control
    type="text"
    onChange={({ target }) => onChange(target.value)}
    {...rest}
  />
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

export type ConnectedFieldTextWithLabelProps = ConnectedFieldTextProps & {
  controlId: string,
  label: string
};

export const ConnectedFieldTextWithLabel = ({
  controlId,
  label,
  ...rest
}: ConnectedFieldTextWithLabelProps) => (
  <BootstrapForm.Group controlId={controlId}>
    <BootstrapForm.Label>{label}</BootstrapForm.Label>
    <ConnectedFieldText {...rest} />
  </BootstrapForm.Group>
);

export default ConnectedFieldTextWithLabel;
