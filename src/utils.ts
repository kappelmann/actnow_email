import {
  stringify,
  parse
} from "qs";

import { DatabaseLocation } from "./databases/databaseLocations";
import { Recipients } from "./fields/FieldSelectRecipients";
import { QueryParamsKeys } from "./routing/routes/QueryParams";

export const tableColumns = (t : (display : string) => string, columns : string[]) => {
  return columns.map((column) => ({
    Header: t(column),
    accessor: column
  }));
};


export type createQueryParamsType = {
  toIds?: string[],
  ccIds?: string[],
  bccIds?: string[],
  to?: string[],
  cc?: string[],
  bcc?: string[],
  mailSubject?: string,
  mailBody?: string,
  shortAlias?: string,
  open?: boolean
};

export const createQueryParams = ({
  toIds,
  ccIds,
  bccIds,
  to,
  cc,
  bcc,
  mailSubject,
  mailBody,
  shortAlias,
  open
} : createQueryParamsType) => ({
  ...toIds !== undefined && { [QueryParamsKeys.ToIds]: toIds },
  ...ccIds !== undefined && { [QueryParamsKeys.CcIds]: ccIds },
  ...bccIds !== undefined && { [QueryParamsKeys.BccIds]: bccIds },
  ...to !== undefined && { [QueryParamsKeys.To]: to },
  ...cc !== undefined && { [QueryParamsKeys.Cc]: cc },
  ...bcc !== undefined && { [QueryParamsKeys.Bcc]: bcc },
  ...mailSubject !== undefined && { [QueryParamsKeys.MailSubject]: mailSubject },
  ...mailBody !== undefined && { [QueryParamsKeys.MailBody]: mailBody },
  ...shortAlias !== undefined && { [QueryParamsKeys.ShortAlias]: shortAlias },
  ...open !== undefined && { [QueryParamsKeys.Open]: open }
});

export const stringifyQueryParams = (query : Record<string, boolean | string | string[] | undefined>) => (
  stringify(query, { arrayFormat: "brackets" })
);

export const stringifyQueryParamsCommas = (query : Record<string, boolean | string | string[] | undefined>) => (
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

export const sortRecipients = (recipients : Recipients) =>
  Object.keys(recipients).sort((recipientId1, recipientId2) =>
    recipients[recipientId1].name.localeCompare(recipients[recipientId2].name));

export const isMdOrSmaller = (outerWidth : number) => outerWidth <= 768;

export const databaseBasePath = (databaseLocation : DatabaseLocation) => {
  const { URL, filename } = databaseLocation;
  return `${URL}/${filename}`;
};

export const databasePath = (databaseLocation : DatabaseLocation, version? : string) =>
  `${databaseBasePath(databaseLocation)}${version ? `_${version}` : ""}.db`;

export const databaseConfigPath = (databaseLocation : DatabaseLocation) =>
  `${databaseBasePath(databaseLocation)}_config.json`;

