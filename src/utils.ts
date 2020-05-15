export const tableColumns = (t : (display : string) => string, columns : string[]) => {
  return columns.map((column) => ({
    Header: t(column),
    accessor: column
  }));
};
