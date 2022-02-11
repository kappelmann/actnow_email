import React from "react";
import { useTranslation } from "react-i18next";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_EU_FRACTIONS,
  SelectEuFractionsParams
} from "../../databases/meps/sqls";

export type FieldEuFractionsProps = Omit<FieldConnectedSelectProps, "sql" | "label"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectEuFractionsParams
};

export const FieldEuFractions = ({
  label,
  multiple = true,
  params = {},
  ...rest
} : FieldEuFractionsProps) => {
  const { t } = useTranslation();
  return (
    <FieldConnectedSelect
      label={label ?? t("Select EU fractions")}
      multiple={multiple}
      sql={SELECT_EU_FRACTIONS(params)}
      {...rest}
    />
  );
};

export default FieldEuFractions;
