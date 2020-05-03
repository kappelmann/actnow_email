import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import { SELECT_EU_FRACTIONS } from "../../consts/sqls";

// FIXME: just exclude sql and label and keep the rest
export type FieldEuFractionsProps = Partial<FieldConnectedSelectProps> & {
  name: FieldConnectedSelectProps["name"];
  controlId: FieldConnectedSelectProps["controlId"];
};

export const FieldEuFractions = ({
  label = "Select EU fractions",
  multiple = true,
  sql = SELECT_EU_FRACTIONS.sql({}),
  ...rest
} : FieldEuFractionsProps) => (
  <FieldConnectedSelect
    label={label}
    multiple={multiple}
    sql={sql}
    {...rest}
  />
);

export default FieldEuFractions;
