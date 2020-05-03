import React from "react";
import ReactSelect from "react-select";
import {
  FieldInputProps,
  useField
} from "formik";
import BootstrapForm from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

export type FieldSelectValue = string | string[] | undefined;

export type FieldSelectProps = Partial<Omit<FieldInputProps<FieldSelectValue>, "onChange">> & {
  defaultValue?: FieldSelectValue,
  onChange?: (value : FieldSelectValue) => any,
  options: string[]
};

export const fieldSelectValueToReactSelectValue = (value : FieldSelectValue) => {
  if (value === undefined) {
    return undefined;
  }
  if (value instanceof Array) {
    return value.map((selection) => ({
      label: selection,
      value: selection
    }));
  }
  return ({ label: value, value });
};


export const FieldSelect = ({
  multiple,
  options,
  onChange = () => {},
  defaultValue,
  value,
  ...rest
}: FieldSelectProps) => {
  const optionsWithLabel = options.map((option) => ({
    label: option,
    value: option
  }));
  return (
    <ReactSelect
      defaultValue={fieldSelectValueToReactSelectValue(defaultValue)}
      value={fieldSelectValueToReactSelectValue(value)}
      options={optionsWithLabel}
      onChange={(selection) => {
        if (!selection) {
          onChange(undefined);
        }
        else if (selection instanceof Array) {
          const selectionValues = selection.map(({ value }) => value);
          onChange(selectionValues);
        } else {
          // not pretty, but we always make sure there is a value so we can safely cast here
          const { value } = (selection as any);
          onChange(value);
        }
      }}
      isMulti={multiple}
      {...rest}
    />
  );
};

export type ConnectedFieldSelectProps = {
  name: string,
  options: string[],
  multiple?: boolean
};

export const ConnectedFieldSelect = ({
  multiple,
  name,
  options
} : ConnectedFieldSelectProps) => {
  const [field, , { setValue }] = useField({ name, multiple });
  return (
    <FieldSelect
      {...field}
      multiple={multiple}
      onChange={setValue}
      options={options}
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
