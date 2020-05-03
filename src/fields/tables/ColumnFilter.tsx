import React from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import {
  FilterValue,
  Row
} from "react-table";

export type ColumnFilter<D extends object> = {
  column: {
    header: string,
    filterValue?: string,
    preFilteredRows: Array<Row<D>>,
    setFilter: (filterValue: FilterValue) => void
  }
};

export const ColumnFilter = <D extends object>({
  column: {
    header,
    filterValue = "",
    setFilter
  }
} : ColumnFilter<D>) => {
  const { t } = useTranslation();

  return (
    <Form.Control
      type="text"
      value={filterValue}
      onChange={({ target } ) => {
        // setting to undefined removes the filter completely
        setFilter(target.value || undefined);
      }}
      placeholder={`${t("Filter")} ${t(header)}...`}
    />
  );
};

export default ColumnFilter;
