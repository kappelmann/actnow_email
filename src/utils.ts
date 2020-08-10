import { stringify, parse } from "qs";

export const tableColumns = (t : (display : string) => string, columns : string[]) => {
  return columns.map((column) => ({
    Header: t(column),
    accessor: column
  }));
};

export const stringifyQueryParams = (query : Record<string, string | string[]>) => (
  stringify(query, { arrayFormat: "brackets", encode: false })
);

export const parseQueryParams = (query: string) => (
  parse(query, { ignoreQueryPrefix: true })
);

export const isNonEmptyStringArray = (data : any) => (
  Array.isArray(data) && data.length > 0 && typeof data[0] === "string"
);

export const arrayIndexToObject = <D extends Record<string, any>>(data : D[], index : string) : Record<string, D> => (
  data.reduce((acc, entry) => ({
    ...acc,
    [entry[index]]: entry
  }), {})
);

export const databasePath = (folder : string, filename : string, version? : string) =>
  `${folder}/${filename}${version ? `_${version}` : ""}.db`;

export const configPath = (folder : string, filename : string) =>
  `${folder}/${filename}_config.json`;

