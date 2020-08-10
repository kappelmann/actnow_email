import React from "react";
import { useTranslation } from "react-i18next";
import { FieldText } from "../FieldText";
import { FilterValue } from "react-table";

export type ColumnFilter<D extends object> = {
  column: {
    Header: string,
    filterValue?: string,
    setFilter: (filterValue: FilterValue) => void
  }
};

export const ColumnFilter = <D extends object>({
  column: {
    Header,
    filterValue = "",
    setFilter
  }
} : ColumnFilter<D>) => {
  const { t } = useTranslation();

  return (
    <FieldText
      value={filterValue}
      name={`${Header}Filter`}
      onBlur={() => {}}
      onChange={(value : FilterValue) => (
        // setting to undefined removes the filter completely
        setFilter(value || undefined)
      )}
      placeholder={`${t("Filter")} ${t(Header)}...`}
    />
  );
};

export default ColumnFilter;
