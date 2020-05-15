import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_EU_FRACTIONS,
  SelectEuFractionsParams
} from "../../database/sqls";

export type FieldEuFractionsProps = Omit<FieldConnectedSelectProps, "sql" | "label"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectEuFractionsParams
};

export const FieldEuFractions = ({
  label = "Select EU fractions",
  multiple = true,
  params = {},
  ...rest
} : FieldEuFractionsProps) => (
  <FieldConnectedSelect
    label={label}
    multiple={multiple}
    sql={SELECT_EU_FRACTIONS(params)}
    {...rest}
  />
);

export default FieldEuFractions;
