import React from "react";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import { SELECT_NATIONAL_PARTIES } from "../../consts/sqls";

// FIXME: just exclude sql and label and keep the rest
export type FieldNationalPartiesProps = Partial<FieldConnectedSelectProps> & {
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"]
};

export const FieldNationalParties = ({
  label = "Select national parties",
  multiple = true,
  sql = SELECT_NATIONAL_PARTIES.sql({}),
  ...rest
} : FieldNationalPartiesProps) => (
  <FieldConnectedSelect
    label={label}
    multiple={multiple}
    sql={sql}
    {...rest}
  />
);

export default FieldNationalParties;
