import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_NATIONAL_PARTIES,
  SelectNationalPartiesParams
} from "../../database/sqls";

export type FieldNationalPartiesProps = Omit<FieldConnectedSelectProps, "sql" | "label"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectNationalPartiesParams
};

export const FieldNationalParties = ({
  label = "Select national parties",
  multiple = true,
  params = {},
  ...rest
} : FieldNationalPartiesProps) => (
  <FieldConnectedSelect
    label={label}
    multiple={multiple}
    sql={SELECT_NATIONAL_PARTIES(params)}
    {...rest}
  />
);

export default FieldNationalParties;
