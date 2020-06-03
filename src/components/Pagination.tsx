import React from "react";
import BootstrapPagination from "react-bootstrap/Pagination";
import styled from "styled-components";

export type PaginationProps= {
  canNextPage?: boolean,
  canPreviousPage?: boolean,
  className?: string,
  gotoPage: (page : number) => any,
  previousPage?: () => any,
  nextPage?: () => any,
  pageCount: number,
  pageIndex: number,
  pageNumbersShownEach?: number,
};

export const Pagination = ({
  canNextPage,
  canPreviousPage,
  className,
  gotoPage,
  nextPage,
  previousPage,
  pageCount,
  pageIndex,
  pageNumbersShownEach = 2
} : PaginationProps) => {
  if (canNextPage === undefined) {
    canNextPage = pageIndex + 1 < pageCount;
  }
  if (canPreviousPage === undefined) {
    canPreviousPage = pageIndex > 0;
  }
  if (nextPage === undefined) {
    nextPage = () => {
      if (canNextPage)
        gotoPage(pageIndex + 1);
    };
  }
  if (previousPage === undefined) {
    previousPage = () => {
      if (canPreviousPage)
        gotoPage(pageIndex - 1);
    };
  }

  const pagesRemainingLeft = pageIndex;
  const pagesRemainingRight = Math.max(pageCount - 1 - pageIndex, 0);

  const pageNumbersShownLeft = Math.min(
    pagesRemainingLeft,
    pageNumbersShownEach + Math.max(pageNumbersShownEach - pagesRemainingRight, 0)
  );
  const pageNumbersShownRight = Math.min(
    pagesRemainingRight,
    pageNumbersShownEach + Math.max(pageNumbersShownEach - pagesRemainingLeft, 0)
  );

  const showLeftEllipsis = pagesRemainingLeft > pageNumbersShownLeft;
  const showRightEllipsis = pagesRemainingRight > pageNumbersShownRight;

  return (
    <BootstrapPagination className={className}>
      <BootstrapPagination.Prev onClick={previousPage} disabled={!canPreviousPage}/>
      {showLeftEllipsis &&
        <BootstrapPagination.Item onClick={() => gotoPage(0)}>{1}</BootstrapPagination.Item>
      }
      {showLeftEllipsis &&
        <BootstrapPagination.Ellipsis onClick={() => gotoPage(pageIndex - pageNumbersShownLeft - 1)} />
      }
      {[...Array(pageNumbersShownLeft)].map((_, index) => {
        const key = pageIndex + 1 - (pageNumbersShownLeft - index);
        return (
          <BootstrapPagination.Item key={key} onClick={() => gotoPage(key - 1)}>{key}</BootstrapPagination.Item>
        );
      })}
      <BootstrapPagination.Item active>{pageIndex + 1}</BootstrapPagination.Item>
      {[...Array(pageNumbersShownRight)].map((_, index) => {
        const key = pageIndex + 1 + index + 1;
        return (
          <BootstrapPagination.Item key={key} onClick={() => gotoPage(key - 1)}>{key}</BootstrapPagination.Item>
        );
      })}
      {showRightEllipsis &&
        <BootstrapPagination.Ellipsis onClick={() => gotoPage(pageIndex + pageNumbersShownRight + 1)} />
      }
      {showRightEllipsis &&
        <BootstrapPagination.Item onClick={() => gotoPage(pageCount - 1)}>{pageCount}</BootstrapPagination.Item>
      }
      <BootstrapPagination.Next onClick={nextPage} disabled={!canNextPage}/>
    </BootstrapPagination>
  );
};

// overwrite react bootstraps z-index
export const StyledPagination = styled(Pagination)`
  & .page-item.active .page-link {
    z-index: 0;
  }
`;

export default StyledPagination;
