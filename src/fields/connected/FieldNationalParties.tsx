import React from "react";
import { useTranslation } from "react-i18next";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_NATIONAL_PARTIES,
  SelectNationalPartiesParams
} from "../../databases/meps/sqls";

export type FieldNationalPartiesProps = Omit<FieldConnectedSelectProps, "sql" | "label"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectNationalPartiesParams
};

export const FieldNationalParties = ({
  label,
  multiple = true,
  params = {},
  ...rest
} : FieldNationalPartiesProps) => {
  const { t } = useTranslation();
  return (
    <FieldConnectedSelect
      label={label ?? t("Select national parties")}
      multiple={multiple}
      sql={SELECT_NATIONAL_PARTIES(params)}
      {...rest}
    />
  );
};

export default FieldNationalParties;
