import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_COUNTRIES,
  SelectCountriesParams
} from "../../database/sqls";

export type FieldCountriesProps = Omit<FieldConnectedSelectProps, "sql" | "label"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectCountriesParams
};

export const FieldCountries = ({
  label = "Select countries",
  multiple = true,
  params = {},
  ...rest
} : FieldCountriesProps) => (
  <FieldConnectedSelect
    label={label}
    multiple={multiple}
    sql={SELECT_COUNTRIES(params)}
    {...rest}
  />
);

export default FieldCountries;
