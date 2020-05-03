import React from "react";
import ReactSelect, {
  Props as ReactSelectProps,
  GroupedOptionsType,
  OptionsType
}  from "react-select";
import { useField } from "formik";
import BootstrapForm from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

export type FieldSelectOptionsType =
  GroupedOptionsType<{ label: string; value: string; }>
| OptionsType<{ label: string; value: string; }>
| undefined;

export type FieldSelectProps = ReactSelectProps;

export const FieldSelect = (props : FieldSelectProps) => (
  <ReactSelect {...props} />
);

export type ConnectedFieldSelectProps = Omit<ReactSelectProps, "name"> & {
  name: string
};

export const ConnectedFieldSelect = ({
  name,
  ...rest
} : ConnectedFieldSelectProps) => {
  const [field, , { setValue }] = useField(name);
  return (
    <ReactSelect
      {...rest}
      {...field}
      onChange={setValue}
    />
  );
};

export type ConnectedFieldSelectWithLabelProps = ConnectedFieldSelectProps & {
  controlId: string,
  label: string
};

export const ConnectedFieldSelectWithLabel = ({
  controlId,
  label,
  ...rest
}: ConnectedFieldSelectWithLabelProps) => {
  const { t } = useTranslation();
  return (
    <BootstrapForm.Group controlId={controlId}>
      <BootstrapForm.Label>{t(label)}</BootstrapForm.Label>
      <ConnectedFieldSelect {...rest} />
    </BootstrapForm.Group>
  );
};

export default ConnectedFieldSelectWithLabel;
