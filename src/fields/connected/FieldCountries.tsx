import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import { SELECT_COUNTRIES } from "../../consts/sqls";

export type FieldCountriesProps = Omit<FieldConnectedSelectProps, "sql"> & {
  sql?: string
};

export const FieldCountries = ({
  controlId = "select-countries",
  name = "countries",
  label = "Select countries",
  isMulti = true,
  sql = SELECT_COUNTRIES.sql({})
} : FieldCountriesProps) => (
  <FieldConnectedSelect
    controlId={controlId}
    name={name}
    label={label}
    isMulti={isMulti}
    sql={sql}
  />
);

export default FieldCountries;
