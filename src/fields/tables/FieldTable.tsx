// FIXME: Check out https://gist.github.com/ggascoigne/646e14c9d54258e40588a13aabf0102d to make the typing cleaner
import React, {
  useMemo
} from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  HeaderGroup,
  Column,
  Row,
  TableInstance,
  TableOptions,
  UseFiltersColumnProps,
  UseFiltersColumnOptions,
  UseFiltersInstanceProps,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByColumnProps
} from "react-table";
import BootstrapTable from "react-bootstrap/Table";
import {
  useField,
  FieldInputProps
} from "formik";

import styled from "styled-components";

import ColumnFilter from "./ColumnFilter";
import ColumnSorter from "./ColumnSorter";
import TableToolbar from "./TableToolbar";
import { StyledFieldCheckbox as FieldCheckbox } from "../FieldCheckbox";

export const FIELD_TABLE_SELECTION_ID = "field-table-selection-id";

export type Selections<D extends Record<string, any>> = Record<string, D>;

export type FieldTablePropsBase<D extends Record<string, any>> = {
  className?: string,
  columns: Column<D>[],
  data: D[],
  getRowId: (data : D) => string,
  entriesPerPageControlId: string,
  paginationControlId: string,
  hiddenColumns?: string[]
};

export type FieldTableProps<D extends Record<string, any>> = FieldTablePropsBase<D> & Omit<FieldInputProps<Selections<D>>, "onChange"> & {
  onChange: (selections: Selections<D>) => any
};

export const FieldTable = <D extends Record<string, any>>({
  className,
  columns: columnsProps,
  data: dataProps,
  getRowId,
  entriesPerPageControlId,
  paginationControlId,
  hiddenColumns = [],
  value,
  onChange,
  name,
  onBlur,
  ...rest
} : FieldTableProps<D>) => {
  const columns = useMemo(() => columnsProps, [columnsProps]);
  const data = useMemo(() => dataProps, [dataProps]);
  const selections = useMemo(() => value, [value]);
  const defaultColumn : Partial<Column<D>> & UseFiltersColumnOptions<D> = useMemo(() => ({
    // Set up the default column filter UI
    Filter: ColumnFilter
  }), []);

  // Note: initial page size feature can be added later if needed
  const initialState = React.useMemo(() => ({
    hiddenColumns,
    pageSize: 10
  }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows are not needed as we use pagination
    // rows,
    filteredRowsById,
    prepareRow,
    state,
    visibleColumns,
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
    initialState,
    getRowId
  } as TableOptions<D>, useFilters, useSortBy, usePagination) as
    TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UsePaginationInstanceProps<D>;

  return (
    <BootstrapTable {...getTableProps()} {...rest} className={className} striped bordered hover responsive>
      <thead>
        <tr>
          <th colSpan={visibleColumns.length + 1} /* + 1 for the checkbox column */>
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
              entriesPerPageControlId={entriesPerPageControlId}
              paginationControlId={paginationControlId}
            />
          </th>
        </tr>
        {headerGroups.map((headerGroup : HeaderGroup<D>, key : number) => {
          const filteredSelections = Object.keys(selections).reduce((acc, rowId) => rowId in filteredRowsById
            ? { ...acc, [rowId]: selections[rowId] }
            : acc, {});
          const filteredSelectionsLength = Object.keys(filteredSelections).length;
          const indeterminate = filteredSelectionsLength < Object.keys(filteredRowsById).length;
          return (
            <tr {...headerGroup.getHeaderGroupProps()} key={key}>
              <th>
                <FieldCheckbox
                  onChange={() => {
                    const checked = 0 < filteredSelectionsLength;
                    if (checked) {
                      // remove the filtered entries from the selections
                      const newSelections = Object.keys(filteredSelections).reduce((acc, key) => {
                        delete acc[key];
                        return acc;
                      }, selections);
                      onChange(newSelections);
                    } else {
                      const filteredRowsValues = Object.keys(filteredRowsById).reduce((acc, rowId) => ({
                        ...acc,
                        [rowId]: filteredRowsById[rowId].original
                      }), {});
                      // add the filtered entries to the selections
                      onChange({ ...selections, ...filteredRowsValues });
                    }
                  }}
                  indeterminate={indeterminate}
                  value={0 < Object.keys(selections).length}
                  ariaLabel={`${name}-header-checkbox`}
                  name={`${name}-header-checkbox`}
                  onBlur={onBlur}
                />
              </th>
              {headerGroup.headers.map((column, key : number) => (
                <th key={key}>
                  {/* add the sorting props to control sorting*/}
                  <div {...column.getHeaderProps((column as any as UseSortByColumnProps<D>).getSortByToggleProps())}>
                    {column.render("Header")}
                    {/* add a sort direction indicator */
                      (column as any as UseSortByColumnProps<D>).canSort &&
                        <ColumnSorter {...(column as any as UseSortByColumnProps<D>)} />
                    }
                  </div>
                  {/* render the columns filter UI */
                    (column as any as UseFiltersColumnProps<D>).canFilter && column.render("Filter")
                  }
                </th>
              ))}
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row : Row<D>, key) => {
          prepareRow(row);
          const rowId = getRowId(row.original);
          const selected = rowId in selections;
          const rowOnChange = () => {
            if (!selected) {
              const rowData = row.original;
              onChange({ ...selections, [rowId]: rowData });
            } else {
              const newSelections = {...selections};
              delete newSelections[rowId];
              onChange(newSelections);
            }
          };
          return (
            <tr
              {...row.getRowProps()}
              onClick={rowOnChange}
              key={key}
            >
              <td>
                <FieldCheckbox
                  onChange={rowOnChange}
                  value={selected}
                  ariaLabel={`${name}-checkbox-${key}`}
                  name={`${name}-checkbox-${key}`}
                  onBlur={onBlur}
                />
              </td>
              {row.cells.map((cell, key) => (
                <td {...cell.getCellProps()} key={key}>
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

export type ConnectedFieldTableProps<D extends Record<string, any>> = FieldTablePropsBase<D> & {
  name: string
};

export const ConnectedFieldTable = <D extends Record<string, any>>({
  name,
  ...rest
}: ConnectedFieldTableProps<D>) => {
  // Note: For now, field tables are always multi select
  const [field, , { setValue }] = useField({ name, multiple: true });

  return (
    <FieldTable
      {...field}
      onChange={setValue}
      {...rest}
    />
  );
};

export const StyledConnectedFieldTable = styled(ConnectedFieldTable)`
  & tbody > tr {
    cursor: pointer;
  }
`;

export default StyledConnectedFieldTable;
