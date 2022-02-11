import React from "react";
import { UseSortByColumnProps } from "react-table";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSort } from "@fortawesome/free-solid-svg-icons/faSort";
import { faSortUp } from "@fortawesome/free-solid-svg-icons/faSortUp";
import { faSortDown } from "@fortawesome/free-solid-svg-icons/faSortDown";

export type ColumnSorterProps<D extends object> = UseSortByColumnProps<D>;

export const ColumnSorter = <D extends object>({
  canSort,
  isSorted,
  isSortedDesc
} : ColumnSorterProps<D>) => {
  if (!canSort) return null;
  const icon = !isSorted
    ? faSort
    : isSortedDesc
      ? faSortDown
      : faSortUp;
  return (
    <Button className="m-0 p-0 bg-transparent" variant="light">
      <FontAwesomeIcon icon={icon} fixedWidth />
    </Button>
  );
};

export default ColumnSorter;
