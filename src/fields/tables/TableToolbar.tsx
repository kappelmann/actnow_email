import React from "react";
import {
  UsePaginationInstanceProps,
  UsePaginationState
} from "react-table";
import { useTranslation } from "react-i18next";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";

import { FieldSelect } from "../FieldSelect";
import Pagination from "../../Pagination";

export type TableToolbarProps<D extends object> = UsePaginationInstanceProps<D> & UsePaginationState<D> & {
  pageNumbersShownEach?: number,
  optionsRowsPerPage?: number[],
  rowsPerPageDefault?: number,
  entriesPerPageControlId: string,
  goToPageControlId: string
};

export const TableToolbar = <D extends object>({
  canNextPage,
  canPreviousPage,
  gotoPage,
  previousPage,
  nextPage,
  pageCount,
  pageSize,
  pageIndex,
  setPageSize,
  pageNumbersShownEach = 2,
  optionsRowsPerPage = [10, 20, 50, 100],
  entriesPerPageControlId,
  goToPageControlId
} : TableToolbarProps<D>) => {
  const { t } = useTranslation();
  return (
    <Form.Row className="align-items-center">
      <Col xs={12} md>
        <Form.Group controlId={entriesPerPageControlId}>
          <Form.Label>{t("Entries per page")}</Form.Label>
          <FieldSelect
            multiple={false}
            defaultValue={pageSize.toString()}
            onChange={(selection) => {
              const value = selection !== undefined && selection || pageSize;
              setPageSize(Number(value));
            }}
            options={optionsRowsPerPage.map((number) => number.toString())}
          />
        </Form.Group>
      </Col>
      <Col xs={12} md>
        <Form.Group controlId={goToPageControlId}>
          <Form.Label>{t("Back and Forward")}</Form.Label>
          <Pagination
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            gotoPage={gotoPage}
            nextPage={nextPage}
            previousPage={previousPage}
            pageCount={pageCount}
            pageIndex={pageIndex}
            pageNumbersShownEach={pageNumbersShownEach}
          />
        </Form.Group>
      </Col>
    </Form.Row>
  );
};

export default TableToolbar;
