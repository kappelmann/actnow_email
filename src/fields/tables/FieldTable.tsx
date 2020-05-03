import React from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useRowSelect,
  HeaderGroup,
  Column,
  Row,
  TableInstance,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
  UseFiltersColumnProps,
  UseSortByColumnProps
} from "react-table";
import BootstrapTable from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

import TableGlobalFilter from "./TableGlobalFilter";
import ColumnFilter from "./ColumnFilter";
import ColumnSorter from "./ColumnSorter";
import {
  HeaderCheckbox,
  RowCheckbox
} from "./TableCheckboxes";

export type FieldTableProps<D extends object> = {
  globalFilterControlId: string,
  columns: Column<D>[],
  data: D[]
};

export const FieldTable = <D extends object>({
  columns: columnsProps,
  data: dataProps,
  globalFilterControlId
} : FieldTableProps<D>) => {

  const columns = React.useMemo(() => columnsProps, [columnsProps]);
  const data = React.useMemo(() => dataProps, [dataProps]);
  const defaultColumn = React.useMemo(() => ({
    // Set up the default column filter UI
    Filter: ColumnFilter
  }), []) as Partial<Column<D>>;

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter
    // selectedFlatRows
  } = useTable<D>({
    columns,
    data,
    defaultColumn
  }, useFilters, useGlobalFilter, useSortBy, useRowSelect,
  (hooks) => {
    hooks.visibleColumns.push((columns) => [
      // we add a column for selections
      {
        id: "selection",
        Header: HeaderCheckbox,
        Cell: RowCheckbox
      },
      ...columns
    ]);
  }) as TableInstance<D> & UseGlobalFiltersInstanceProps<D>;

  return (
    <BootstrapTable {...getTableProps()} striped bordered hover responsive>
      <thead>
        <tr>
          <th colSpan={visibleColumns.length}>
            <TableGlobalFilter
              controlId={globalFilterControlId}
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilterValue={(state as UseGlobalFiltersState<D>).globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup : HeaderGroup<D>, key : number) => (
          <tr key={key} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, key : number) => (
              <th key={key}>
                <Form.Row>
                  {/* add the sorting props to control sorting*/}
                  <Col sm="auto" {...column.getHeaderProps((column as any as UseSortByColumnProps<D>).getSortByToggleProps())}>
                    {/* add a sort direction indicator */
                      (column as any as UseSortByColumnProps<D>).canSort &&
                        <ColumnSorter {...(column as any as UseSortByColumnProps<D>)} />
                    }
                    {column.render("Header")}
                  </Col>
                  {/* render the columns filter UI */
                    (column as any as UseFiltersColumnProps<D>).canFilter &&
                      <Col>
                        {column.render("Filter")}
                      </Col>
                  }
                </Form.Row>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row : Row<D>, key : number) => {
          prepareRow(row);
          return (
            <tr key={key} {...row.getRowProps()}>
              {row.cells.map((cell, key) => (
                <td key={key} {...cell.getCellProps()}>
                  {cell.render("Cell")}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </BootstrapTable>
  );
};

export default FieldTable;
