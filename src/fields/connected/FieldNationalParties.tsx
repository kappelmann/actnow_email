import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import { SELECT_NATIONAL_PARTIES } from "../../consts/sqls";

export type FieldNationalPartiesProps = Omit<FieldConnectedSelectProps, "sql"> & {
  sql?: string
};

export const FieldNationalParties = ({
  controlId = "select-national-parties",
  name = "nationalParties",
  label = "Select national parties",
  isMulti = true,
  sql = SELECT_NATIONAL_PARTIES.sql({})
} : FieldNationalPartiesProps) => (
  <FieldConnectedSelect
    controlId={controlId}
    name={name}
    label={label}
    isMulti={isMulti}
    sql={sql}
  />
);

export default FieldNationalParties;
