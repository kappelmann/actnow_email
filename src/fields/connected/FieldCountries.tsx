import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import { SELECT_COUNTRIES } from "../../consts/sqls";

// FIXME: just exclude sql and label and keep the rest
export type FieldCountriesProps = Partial<FieldConnectedSelectProps> & {
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"]
};

export const FieldCountries = ({
  label = "Select countries",
  multiple = true,
  sql = SELECT_COUNTRIES.sql({}),
  ...rest
} : FieldCountriesProps) => (
  <FieldConnectedSelect
    label={label}
    multiple={multiple}
    sql={sql}
    {...rest}
  />
);

export default FieldCountries;
