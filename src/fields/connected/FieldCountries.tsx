import React from "react";
import { useTranslation } from "react-i18next";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_COUNTRIES,
  SelectCountriesParams
} from "../../databases/meps/sqls";

export type FieldCountriesProps = Omit<FieldConnectedSelectProps, "sql" | "label"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectCountriesParams
};

export const FieldCountries = ({
  label,
  multiple = true,
  params = {},
  ...rest
} : FieldCountriesProps) => {
  const { t } = useTranslation();
  return (
    <FieldConnectedSelect
      label={label ?? t("Select countries")}
      multiple={multiple}
      sql={SELECT_COUNTRIES(params)}
      {...rest}
    />
  );
};

export default FieldCountries;
