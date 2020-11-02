import React from "react";
import ReactSelect from "react-select";
import ReactSelectCreatable from "react-select/creatable";
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
  creatable?: boolean,
  defaultValue?: FieldSelectValue<O>,
  getOptionLabel?: (option : FieldSelectOption<O>) => string,
  searchable?: boolean,
  isClearable?: boolean,
  placeholder?: string,
  options: FieldSelectOption<O>[],
  noOptionsMessage?: () => string,
  isValidNewOption?: (inputValue : string, selectValue : FieldSelectValue<O>, selectOptions : FieldSelectOption<O>[]) => boolean,
  formatCreateLabel?: (inputValue : string) => string
};

export type FieldSelectProps<O extends FieldValueBase> = FieldSelectPropsBase<O> & Omit<FieldInputProps<FieldSelectValue<O>>, "onChange"> & {
  onChange: (selection : FieldSelectValue<O>) => any;
};

export type ReactSelectValue<O extends FieldValueBase> = undefined | {label: string, value: O} | {label: string, value: O}[];

export const fieldSelectValueToReactSelectValue =
<O extends FieldValueBase>(value : FieldSelectValue<O>, getLabel : (option : FieldSelectOption<O>) => string) : ReactSelectValue<O> => {
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
  creatable = false,
  ...rest
}: FieldSelectProps<O>) => {
  const { t } = useTranslation();
  const placeholder = placeholderProp ?? `${t("Select")}...`;

  const optionsWithLabel = options.map((option) => ({
    label: getOptionLabel(option),
    value: option
  }));

  const Component = (props : any) => creatable ? <ReactSelectCreatable {...props} /> : <ReactSelect {...props} />;

  return (
    <Component
      defaultValue={fieldSelectValueToReactSelectValue(defaultValue, getOptionLabel)}
      value={fieldSelectValueToReactSelectValue(value, getOptionLabel)}
      options={optionsWithLabel}
      onChange={(selection : ReactSelectValue<O>) => {
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

export type ConnectedFieldSelectProps<O extends FieldValueBase> = FieldSelectPropsBase<O> & {
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
    <FieldSelect
      {...field}
      multiple={multiple}
      onChange={setValue}
      {...rest}
    />
  );
};

export type ConnectedFieldSelectWithLabelProps<O extends FieldValueBase> = FieldSelectPropsBase<O> &
  Pick<FieldSelectWithLabelProps<O>, "controlId" | "label"> & {
  name: string,
  multiple?: boolean
};

export const ConnectedFieldSelectWithLabel = <O extends FieldValueBase>({
  multiple,
  name,
  ...rest
} : ConnectedFieldSelectWithLabelProps<O>) => {
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

export default ConnectedFieldSelectWithLabel;
