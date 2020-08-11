import React from "react";
import ReactSelect from "react-select";
import {
  FieldInputProps,
  useField
} from "formik";
import BootstrapForm from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { FieldValueBase } from "./types";

export type FieldSelectOption<O extends FieldValueBase> = O;
export type FieldSelectValue<O extends FieldValueBase> = FieldSelectOption<O> | FieldSelectOption<O>[] | undefined;

export type FieldSelectPropsBase<O extends FieldValueBase> = {
  id?: string,
  defaultValue?: FieldSelectValue<O>,
  getOptionLabel?: (option : FieldSelectOption<O>) => string,
  searchable?: boolean,
  isClearable?: boolean,
  placeholder?: string,
  options: FieldSelectOption<O>[],
  noOptionsMessage?: () => string
};

export type FieldSelectProps<O extends FieldValueBase> = FieldSelectPropsBase<O> & Omit<FieldInputProps<FieldSelectValue<O>>, "onChange"> & {
  onChange: (selection : FieldSelectValue<O>) => any;
};

export const fieldSelectValueToReactSelectValue =
<O extends FieldValueBase>(value : FieldSelectValue<O>, getLabel : (option : FieldSelectOption<O>) => string) => {
  if (value === undefined) return undefined;

  if (value instanceof Array)
    return value.map((singleValue) => ({
      label: getLabel(singleValue),
      value: singleValue
    }));

  return { label: getLabel(value), value };
};

export const FieldSelect = <O extends FieldValueBase>({
  multiple,
  options,
  getOptionLabel = (option) => option.toString(),
  onChange,
  defaultValue,
  value,
  placeholder: placeholderProp,
  searchable = true,
  ...rest
}: FieldSelectProps<O>) => {
  const { t } = useTranslation();
  const placeholder = placeholderProp ?? t("Select...");

  const optionsWithLabel = options.map((option) => ({
    label: getOptionLabel(option),
    value: option
  }));

  return (
    <ReactSelect
      defaultValue={fieldSelectValueToReactSelectValue(defaultValue, getOptionLabel)}
      value={fieldSelectValueToReactSelectValue(value, getOptionLabel)}
      options={optionsWithLabel ? optionsWithLabel : []}
      onChange={(selection) => {
        if (!selection) {
          onChange(undefined);
        }
        else if (selection instanceof Array) {
          const selectionValues = selection.map(({ value }) => value);
          onChange(selectionValues);
        } else {
          // not pretty, but we always make sure there is a value so we can safely cast here
          const { value } = selection as any;
          onChange(value);
        }
      }}
      isMulti={multiple}
      isSearchable={searchable}
      placeholder={placeholder}
      {...rest}
    />
  );
};

export type FieldSelectWithLabelProps<O extends FieldValueBase> = Omit<FieldSelectProps<O>, "id"> & {
  controlId: string,
  label: string
};

export const FieldSelectWithLabel = <O extends FieldValueBase>({
  controlId,
  label,
  ...rest
}: FieldSelectWithLabelProps<O>) => {
  return (
    <BootstrapForm.Group controlId={controlId}>
      <BootstrapForm.Label>{label}</BootstrapForm.Label>
      <FieldSelect id={controlId} {...rest} />
    </BootstrapForm.Group>
  );
};

export type ConnectedFieldSelectProps<O extends FieldValueBase> = Omit<FieldSelectPropsBase<O>, "defaultValue"> &
  Pick<FieldSelectWithLabelProps<O>, "controlId" | "label"> & {
  name: string,
  multiple?: boolean
};

export const ConnectedFieldSelect = <O extends FieldValueBase>({
  multiple,
  name,
  ...rest
} : ConnectedFieldSelectProps<O>) => {
  const [field, , { setValue }] = useField({ name, multiple });
  return (
    <FieldSelectWithLabel
      {...field}
      multiple={multiple}
      onChange={setValue}
      {...rest}
    />
  );
};

export default ConnectedFieldSelect;
