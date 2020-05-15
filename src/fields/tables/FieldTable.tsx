// FIXME: Check out https://gist.github.com/ggascoigne/646e14c9d54258e40588a13aabf0102d to make the typing cleaner
import React, {
  useEffect
} from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useRowSelect,
  usePagination,
  HeaderGroup,
  Column,
  Row,
  TableInstance,
  UseGlobalFiltersInstanceProps,
  UseGlobalFiltersState,
  UseFiltersColumnProps,
  UseFiltersColumnOptions,
  UseRowSelectInstanceProps,
  UseRowSelectRowProps,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByColumnProps
} from "react-table";
import BootstrapTable from "react-bootstrap/Table";
import BootstrapForm from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import {
  useField,
  FieldInputProps
} from "formik";

import TableGlobalFilter from "./TableGlobalFilter";
import ColumnFilter from "./ColumnFilter";
import ColumnSorter from "./ColumnSorter";
import {
  HeaderCheckbox,
  RowCheckbox
} from "./TableCheckboxes";
import TableToolbar from "./TableToolbar";

export const FIELD_TABLE_SELECTION_ID = "field-table-selection-id";

export type FieldTableBaseProps<D extends object> = {
  columns: Column<D>[],
  data: D[],
  entriesPerPageControlId: string,
  goToPageControlId: string,
  globalFilterControlId: string,
  hiddenColumns?: string[],
  onChange?: (selections: D[]) => any
};

export type FieldTableProps<D extends object> = Partial<Omit<FieldInputProps<D>, "onChange">> &
  FieldTableBaseProps<D>;

export const FieldTable = <D extends object>({
  columns: columnsProps,
  data: dataProps,
  entriesPerPageControlId,
  goToPageControlId,
  globalFilterControlId,
  hiddenColumns = [],
  onChange = () => {},
  // TODO: onBlur could be set on checkboxes, but there is no need for now
  // as there is no validation.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onBlur,
  ...rest
} : FieldTableProps<D>) => {
  const columns = React.useMemo(() => columnsProps, [columnsProps]);
  const data = React.useMemo(() => dataProps, [dataProps]);
  const defaultColumn : Partial<Column<D>> & UseFiltersColumnOptions<D> = React.useMemo(() => ({
    // Set up the default column filter UI
    Filter: ColumnFilter
  }), []);

  // Note: initial page size feature can be added later if needed
  const initialState = React.useMemo(() => ({
    hiddenColumns,
    pageSize: 20
  }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows are not needed as we use pagination
    // rows,
    prepareRow,
    state,
    visibleColumns,
    // filters
    preGlobalFilteredRows,
    setGlobalFilter,
    // selection
    selectedFlatRows,
    // pagination: instead of using "rows", we"ll use page,
    // which has only the rows for the active page
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize
  } = useTable<D>({
    columns,
    data,
    defaultColumn,
    initialState
  }, useFilters, useGlobalFilter, useSortBy, useRowSelect, usePagination, (hooks) => {
    hooks.visibleColumns.push((columns) => [
      // add a column for selections
      {
        id: FIELD_TABLE_SELECTION_ID,
        Header: HeaderCheckbox,
        Cell: RowCheckbox
      },
      ...columns
    ]);
  }) as TableInstance<D> &
    UseGlobalFiltersInstanceProps<D> &
    UseRowSelectInstanceProps<D> &
    UsePaginationInstanceProps<D>;

  useEffect(() => {
    onChange(selectedFlatRows.map(({ values }) => values as D));
    // FIXME: the reference to selectedFlatRows sadly changes on every render
    // making useEffect loop when using selectedFlatRows as a dependency;
    // as a temporary fix, we use a dependency on the length instead and pray for the best
  }, [selectedFlatRows.length]);

  return (
    <BootstrapTable {...getTableProps()} {...rest} striped bordered hover responsive>
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
        <tr>
          <th colSpan={visibleColumns.length}>
            <TableToolbar
              page={page}
              canPreviousPage={canPreviousPage}
              canNextPage={canNextPage}
              pageOptions={pageOptions}
              pageCount={pageCount}
              gotoPage={gotoPage}
              nextPage={nextPage}
              previousPage={previousPage}
              setPageSize={setPageSize}
              pageSize={(state as UsePaginationState<D>).pageSize}
              pageIndex={(state as UsePaginationState<D>).pageIndex}
              goToPageControlId={goToPageControlId}
              entriesPerPageControlId={entriesPerPageControlId}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup : HeaderGroup<D>, key : number) => (
          <tr key={key} {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column, key : number) => (
              <th key={key}>
                <BootstrapForm.Row>
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
                </BootstrapForm.Row>
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row : Row<D>, key : number) => {
          prepareRow(row);
          return (
            <tr
              key={key}
              onClick={() => (row as any as UseRowSelectRowProps<D>).toggleRowSelected(
                !(row as any as UseRowSelectRowProps<D>).isSelected
              )}
              {...row.getRowProps()}
            >
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

export type ConnectedFieldTableProps<D extends object> = FieldTableBaseProps<D> & {
  name: string
};

export const ConnectedFieldTable = <D extends object>({
  name,
  ...rest
}: ConnectedFieldTableProps<D>) => {
  // Note: For now, field tables are always multi select
  const [field, , { setValue }] = useField({ name, multiple: true });

  return (
    <FieldTable
      {...rest}
      {...field}
      onChange={setValue}
    />
  );
};

export default ConnectedFieldTable;
