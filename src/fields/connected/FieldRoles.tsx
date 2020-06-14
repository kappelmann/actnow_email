import React from "react";
import { useTranslation } from "react-i18next";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_ROLES,
  SelectRolesParams
} from "../../database/sqls";

export type FieldRolesProps = Omit<FieldConnectedSelectProps, "sql" | "label"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectRolesParams
};

export const FieldRoles = ({
  label,
  multiple = true,
  params = {},
  ...rest
} : FieldRolesProps) => {
  const { t } = useTranslation();
  return (
    <FieldConnectedSelect
      label={label ?? t("Select roles")}
      multiple={multiple}
      sql={SELECT_ROLES(params)}
      {...rest}
    />
  );
};

export default FieldRoles;
