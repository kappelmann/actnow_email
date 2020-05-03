import React from "react";
import { UseSortByColumnProps } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortUp,
  faSortDown
} from "@fortawesome/free-solid-svg-icons";

export type ColumnSorterProps<D extends object> = UseSortByColumnProps<D>;

export const ColumnSorter = <D extends object>({
  canSort,
  isSorted,
  isSortedDesc
} : ColumnSorterProps<D>) => {
  if (!canSort) return null;
  if (!isSorted) return <FontAwesomeIcon icon={faSort} fixedWidth />;
  if (isSortedDesc) return <FontAwesomeIcon icon={faSortDown} fixedWidth />;
  return <FontAwesomeIcon icon={faSortUp} fixedWidth />;
};

export default ColumnSorter;
