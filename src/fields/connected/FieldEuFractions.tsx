import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import { SELECT_EU_FRACTIONS } from "../../consts/sqls";

export type FieldEuFractionsProps = Omit<FieldConnectedSelectProps, "sql"> & {
  sql?: string
};

export const FieldEuFractions = ({
  controlId = "select-eu-fractions",
  name = "euFractions",
  label = "Select EU fractions",
  isMulti = true,
  sql = SELECT_EU_FRACTIONS.sql({})
} : FieldEuFractionsProps) => (
  <FieldConnectedSelect
    controlId={controlId}
    name={name}
    label={label}
    isMulti={isMulti}
    sql={sql}
  />
);

export default FieldEuFractions;
