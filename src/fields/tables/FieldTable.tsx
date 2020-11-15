// FIXME: Check out https://gist.github.com/ggascoigne/646e14c9d54258e40588a13aabf0102d to make the typing cleaner
import React, {
  useMemo
} from "react";
import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useExpanded,
  HeaderGroup,
  Column,
  Row,
  TableInstance,
  TableOptions,
  UseExpandedInstanceProps,
  UseExpandedRowProps,
  UseFiltersColumnProps,
  UseFiltersColumnOptions,
  UseFiltersInstanceProps,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByColumnProps
} from "react-table";
import Button from "react-bootstrap/Button";
import BootstrapTable from "react-bootstrap/Table";
import {
  useField,
  FieldInputProps
} from "formik";

import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinusSquare,
  faPlusSquare
} from "@fortawesome/free-solid-svg-icons";
import useWindowSize from "../../hooks/useWindowSize";

import ColumnFilter from "./ColumnFilter";
import ColumnSorter from "./ColumnSorter";
import TableToolbar from "./TableToolbar";
import { StyledFieldCheckbox as FieldCheckbox } from "../FieldCheckbox";

import { isMdOrSmaller } from "../../utils";

export const FIELD_TABLE_SELECTION_ID = "field-table-selection-id";

export type Selection<D extends Record<string, any>> = Record<string, D>;

export type FieldTablePropsBase<D extends Record<string, any>> = {
  className?: string,
  columns: Column<D>[],
  data: D[],
  getRowId: (data : D) => string,
  entriesPerPageControlId: string,
  paginationControlId: string,
  hiddenColumns?: string[],
  maxColsBeforeDetails?: number,
  maxColsBeforeDetailsMdOrSmaller?: number
};

export type FieldTableProps<D extends Record<string, any>> = FieldTablePropsBase<D> & Omit<FieldInputProps<Selection<D>>, "onChange"> & {
  onChange: (selection: Selection<D>) => any
};

export const FieldTable = <D extends Record<string, any>>({
  className,
  columns: columnsProps,
  data: dataProps,
  getRowId,
  entriesPerPageControlId,
  paginationControlId,
  hiddenColumns = [],
  maxColsBeforeDetails = 4,
  maxColsBeforeDetailsMdOrSmaller = 2,
  value,
  onChange,
  name,
  onBlur,
  ...rest
} : FieldTableProps<D>) => {
  const columns = useMemo(() => columnsProps, [columnsProps]);
  const data = useMemo(() => dataProps, [dataProps]);
  const selection = useMemo(() => value, [value]);
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
    setPageSize,
    // subrow expanding
    isAllRowsExpanded,
    toggleAllRowsExpanded
  } = useTable<D>({
    columns,
    data,
    defaultColumn,
    initialState,
    getRowId,
    autoResetExpanded: false
  } as TableOptions<D>, useFilters, useSortBy, useExpanded, usePagination) as
    TableInstance<D> &
    UseFiltersInstanceProps<D> &
    UsePaginationInstanceProps<D> &
    UseExpandedInstanceProps<D>;

  const checked = 0 < Object.keys(selection).length;
  const filteredSelection = useMemo(() => Object.keys(selection).reduce((acc, rowId) => rowId in filteredRowsById
    ? { ...acc, [rowId]: selection[rowId] }
    : acc, {})
  , [selection, filteredRowsById]);
  const filteredSelectionLength = useMemo(() => Object.keys(filteredSelection).length, [filteredSelection]);
  const indeterminate = useMemo(() => checked && filteredSelectionLength < Object.keys(filteredRowsById).length,
    [checked, filteredSelectionLength, filteredRowsById]);
  const visibleColumnsLength = visibleColumns.length + 2; // + 1 for the checkbox column, 1 for the details button
  // only show details button on md devices and below
  const hideDetailsClass = "d-none"; // d-md-table-cell
  const { outerWidth } = useWindowSize();
  const sizeIsMdOrSmaller = isMdOrSmaller(outerWidth);
  const maxCols = sizeIsMdOrSmaller ? maxColsBeforeDetailsMdOrSmaller : maxColsBeforeDetails;
  const showClass = "";
  const showDetailsClass = visibleColumns.length <= maxCols ? "d-none" : showClass;
  const classNameFromKeyHide = (key : number) => key >= maxCols ? hideDetailsClass : showClass;
  const classNameFromKeyShow = (key : number) => key < maxCols ? hideDetailsClass : showClass;

  return (
    <BootstrapTable
      {...getTableProps()}
      {...rest}
      className={className}
      size={sizeIsMdOrSmaller ? "sm" : undefined}
      striped
      bordered
      hover
      responsive
    >
      <thead>
        <tr>
          <th colSpan={visibleColumnsLength}>
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
          return (
            <tr {...headerGroup.getHeaderGroupProps()} key={key}>
              <th>
                <FieldCheckbox
                  onChange={() => {
                    const hasOverlap = 0 < filteredSelectionLength;
                    if (hasOverlap) {
                      // remove the filtered entries from the selection
                      const newSelection = Object.keys(filteredSelection).reduce((acc, key) => {
                        delete acc[key];
                        return acc;
                      }, selection);
                      onChange(newSelection);
                    } else {
                      const filteredRowsValues = Object.keys(filteredRowsById).reduce((acc, rowId) => ({
                        ...acc,
                        [rowId]: filteredRowsById[rowId].original
                      }), {});
                      // add the filtered entries to the selection
                      onChange({ ...selection, ...filteredRowsValues });
                    }
                  }}
                  indeterminate={indeterminate}
                  value={checked}
                  ariaLabel={`${name}-header-checkbox`}
                  name={`${name}-header-checkbox`}
                  onBlur={onBlur}
                />
              </th>
              {headerGroup.headers.map((column, key : number) => (
                <th key={key} className={classNameFromKeyHide(key)}>
                  {/* add the sorting props to control sorting*/}
                  <div {...column.getHeaderProps((column as any as UseSortByColumnProps<D>).getSortByToggleProps())}>
                    {/* add a sort direction indicator */}
                    {(column as any as UseSortByColumnProps<D>).canSort &&
                        <ColumnSorter {...(column as any as UseSortByColumnProps<D>)} />}
                    {column.render("Header")}
                  </div>
                  {/* render the columns filter UI */
                    (column as any as UseFiltersColumnProps<D>).canFilter && column.render("Filter")
                  }
                </th>
              ))}
              <th className={showDetailsClass} onClick={() => toggleAllRowsExpanded()}>
                <Button className="m-0 p-0 bg-transparent" variant="light">
                  <FontAwesomeIcon icon={isAllRowsExpanded ? faMinusSquare : faPlusSquare} fixedWidth />
                </Button>
              </th>
            </tr>
          );
        })}
      </thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row : Row<D>, key) => {
          prepareRow(row);
          const rowId = getRowId(row.original);
          const selected = rowId in selection;
          const rowOnChange = () => {
            if (!selected) {
              const rowData = row.original;
              onChange({ ...selection, [rowId]: rowData });
            } else {
              const newSelection = {...selection};
              delete newSelection[rowId];
              onChange(newSelection);
            }
          };
          const isExpanded = (row as any as UseExpandedRowProps<D>).isExpanded;
          return (
            <React.Fragment key={key}>
              <tr {...row.getRowProps()}>
                <td rowSpan={isExpanded ? 2 : 1}>
                  <FieldCheckbox
                    onChange={rowOnChange}
                    value={selected}
                    ariaLabel={`${name}-checkbox-${key}`}
                    name={`${name}-checkbox-${key}`}
                    onBlur={onBlur}
                  />
                </td>
                {row.cells.map((cell, key) => (
                  <td {...cell.getCellProps()} onClick={rowOnChange} key={key} className={classNameFromKeyHide(key)}>
                    {cell.render("Cell")}
                  </td>
                ))}
                <td className={showDetailsClass} {...(row as any as UseExpandedRowProps<D>).getToggleRowExpandedProps()}>
                  <Button className="m-0 p-0 bg-transparent" variant="light">
                    <FontAwesomeIcon icon={isExpanded ? faMinusSquare : faPlusSquare} fixedWidth />
                  </Button>
                </td>
              </tr>
              {isExpanded ? (
                <tr>
                  <td colSpan={visibleColumnsLength}>
                    {row.cells.map((cell, key) => (
                      <div onClick={rowOnChange} key={key} className={classNameFromKeyShow(key)}>
                        <span className="font-weight-bold" {...cell.column.getHeaderProps((cell.column as any as UseSortByColumnProps<D>).getSortByToggleProps())}>
                          {(cell.column as any as UseSortByColumnProps<D>).canSort &&
                            <ColumnSorter {...(cell.column as any as UseSortByColumnProps<D>)} />}
                          {`${cell.render("Header")} `}
                        </span>
                        {cell.render("Cell")}
                      </div>
                    ))}
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
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
