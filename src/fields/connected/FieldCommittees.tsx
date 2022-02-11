import React from "react";
import { useTranslation } from "react-i18next";

import FieldConnectedSelect, {
  FieldConnectedSelectProps
} from "./FieldConnectedSelect";
import {
  SELECT_COMMITTEES,
  SelectCommitteesParams
} from "../../databases/meps/sqls";

export type FieldCommitteesProps = Omit<FieldConnectedSelectProps, "sql" | "label" | "getOptionLabel"> & {
  label?: FieldConnectedSelectProps["label"],
  name: FieldConnectedSelectProps["name"],
  controlId: FieldConnectedSelectProps["controlId"],
  params?: SelectCommitteesParams
};

export const FieldCommittees = ({
  label,
  multiple = true,
  params = {},
  ...rest
} : FieldCommitteesProps) => {
  const { t } = useTranslation();
  return (
    <FieldConnectedSelect
      label={label ?? t("Select committees")}
      multiple={multiple}
      sql={SELECT_COMMITTEES(params)}
      {...rest}
    />
  );
};

export default FieldCommittees;
