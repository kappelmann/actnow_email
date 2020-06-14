import React from "react";
import BootstrapForm from "react-bootstrap/Form";
import {
  FieldInputProps,
  useField
} from "formik";

export type FieldSearchPropsBase = {
  placeholder?: string
};

export type FieldSearchProps = FieldSearchPropsBase & Omit<FieldInputProps<string>, "onChange"> & {
  onChange: (value : string) => any; };

export const FieldSearch = ({
  onChange,
  ...rest
} : FieldSearchProps) => (
  <BootstrapForm.Control
    type="text"
    onChange={({ target }) => onChange(target.value)}
    {...rest}
  />
);

export type ConnectedFieldSearchProps = FieldSearchPropsBase & {
  name: string
};

export const ConnectedFieldSearch = ({
  name,
  ...rest
} : ConnectedFieldSearchProps) => {
  const [field, , { setValue }] = useField({ name });
  return (
    <FieldSearch
      {...field}
      onChange={setValue}
      {...rest}
    />
  );
};

export type ConnectedFieldSearchWithLabelProps = ConnectedFieldSearchProps & {
  controlId: string,
  label: string
};

export const ConnectedFieldSearchWithLabel = ({
  controlId,
  label,
  ...rest
}: ConnectedFieldSearchWithLabelProps) => (
  <BootstrapForm.Group controlId={controlId}>
    <BootstrapForm.Label>{label}</BootstrapForm.Label>
    <ConnectedFieldSearch {...rest} />
  </BootstrapForm.Group>
);

export default ConnectedFieldSearchWithLabel;
