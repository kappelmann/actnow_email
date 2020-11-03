import React from "react";

import {
  FieldSelectWithLabel,
  FieldSelectWithLabelProps
} from "./FieldSelect";

import {
  isNonEmptyStringArray,
  sortMeps
} from  "../utils";

import { FormMepContactValuesMep } from "../forms/connected/FormMepContact";

export type FieldMepsProps = Omit<FieldSelectWithLabelProps<string>, "options" | "creatable" | "getOptionLabel" | "onChange" | "value"> & {
  options: Record<string, FormMepContactValuesMep>;
  value: Record<string, FormMepContactValuesMep>;
  onChange: (selection : Record<string, FormMepContactValuesMep>) => any;
};

export const FieldMeps = ({
  options,
  value,
  onChange,
  ...rest
} : FieldMepsProps) => {

  const sortedOptionIds = React.useMemo(() => sortMeps(options), [options, Object.keys(options).length]);
  const sortedValueIds = React.useMemo(() => sortMeps(value), [value, Object.keys(value).length]);

  return (
    <FieldSelectWithLabel
      options={sortedOptionIds}
      value={sortedValueIds}
      getOptionLabel={(mepId) => options[mepId as string].name}
      onChange={(mepIds) => {
        const meps = isNonEmptyStringArray(mepIds)
          ? (mepIds as string []).reduce((acc, mepId) => ({
            ...acc,
            [mepId]: options[mepId]
          }), {})
          : {};
        onChange(meps);
      }}
      {...rest}
    />
  );
};

export default FieldMeps;
