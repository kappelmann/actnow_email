import {
  stringify,
  parse
} from "qs";
import {
  FormMepContactValues,
  FormMepContactValuesKeys
} from "./forms/connected/FormMepContact";

export const tableColumns = (t : (display : string) => string, columns : string[]) => {
  return columns.map((column) => ({
    Header: t(column),
    accessor: column
  }));
};

export const stringifyQueryParams = (query : Record<string, boolean | string | string[]>) => (
  stringify(query, { arrayFormat: "brackets" })
);

export const stringifyQueryParamsCommas = (query : Record<string, boolean | string | string[]>) => (
  stringify(query, { arrayFormat: "comma" })
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

export const sortMeps = (meps : FormMepContactValues[FormMepContactValuesKeys.Meps]) =>
  Object.keys(meps).sort((mepId1, mepId2) => meps[mepId1].name.localeCompare(meps[mepId2].name));

export const isMdOrSmaller = (outerWidth : number) => outerWidth <= 768;
