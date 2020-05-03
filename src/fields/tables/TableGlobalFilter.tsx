import React from "react";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import {
  FilterValue,
  Row
} from "react-table";

export type TableGlobalFilter<D extends object> = {
  controlId: string,
  globalFilterValue?: string,
  preGlobalFilteredRows: Array<Row<D>>,
  setGlobalFilter: (filterValue: FilterValue) => void
};

export const TableGlobalFilter = <D extends object>({
  controlId,
  globalFilterValue = "",
  preGlobalFilteredRows,
  setGlobalFilter
} : TableGlobalFilter<D>) => {
  const { t } = useTranslation();
  const count = preGlobalFilteredRows.length;

  return (
    <Form.Group controlId={controlId}>
      <Form.Label>{`${t("Search")}`}</Form.Label>
      <Form.Control
        value={globalFilterValue}
        onChange={({ target } ) => {
          // setting to undefined removes the filter completely
          setGlobalFilter(target.value || undefined);
        }}
        placeholder={t("recordWithCount", { count })}
      />
    </Form.Group>
  );
};

export default TableGlobalFilter;
