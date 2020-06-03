import {
  EmailsColumns,
  NationalPartiesColumns,
  MepsColumns,
  Tables
} from "./types";
import {
  columns,
  tables,
  tableColumn,
  quoteJoin,
  TableColumn
} from "./utils";

export type SqlEntry<P extends object> = (params : P) => string;

export const SELECT_COUNTRIES_COLUMNS : TableColumn[] = [{ table: Tables.NationalParties, column: NationalPartiesColumns.Country }];
export const SELECT_COUNTRIES_TABLES : Tables[] = [Tables.NationalParties, Tables.Meps];

export enum SelectCountriesParamsKeys {
  NationalParties = "nationalParties",
  EuFractions = "euFractions"
}

export type SelectCountriesParams = {
  [k in SelectCountriesParamsKeys]?: string[]
};

export const SELECT_COUNTRIES : SqlEntry<SelectCountriesParams> = ({
  nationalParties = [],
  euFractions = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_COUNTRIES_COLUMNS)}
    FROM ${tables(SELECT_COUNTRIES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
    ${euFractions.length > 0
        ? `${MepsColumns.EuFraction} IN (${quoteJoin(euFractions)})`
        : "TRUE"
      }${" "}
    AND${" "}
    ${nationalParties.length > 0
        ? `${NationalPartiesColumns.Party} IN (${quoteJoin(nationalParties)})`
        : "TRUE"
      }${" "}
    ORDER BY ${NationalPartiesColumns.Country} ASC`;
  /* eslint-enable indent */


export const SELECT_EU_FRACTIONS_COLUMNS : TableColumn[] = [{ table: Tables.Meps, column: MepsColumns.EuFraction }];
export const SELECT_EU_FRACTIONS_TABLES : Tables[] = [Tables.Meps, Tables.NationalParties];

export enum SelectEuFractionsParamsKeys {
  Countries = "countries",
  NationalParties = "nationalParties"
}

export type SelectEuFractionsParams = {
  [k in SelectEuFractionsParamsKeys]?: string[]
};

export const SELECT_EU_FRACTIONS : SqlEntry<SelectEuFractionsParams> = ({
  countries = [],
  nationalParties = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_EU_FRACTIONS_COLUMNS)}
    FROM ${tables(SELECT_EU_FRACTIONS_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
      ${nationalParties.length > 0
        ? `${NationalPartiesColumns.Party} IN (${quoteJoin(nationalParties)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${countries.length > 0
        ? `${NationalPartiesColumns.Country} IN (${quoteJoin(countries)})`
        : "TRUE"
      }${" "}
    ORDER BY ${MepsColumns.EuFraction} ASC`;
  /* eslint-enable indent */


export const SELECT_NATIONAL_PARTIES_TABLES : Tables[] = [Tables.NationalParties, Tables.Meps];

export enum SelectNationalPartiesParamsKeys {
  Countries = "countries",
  EuFractions = "euFractions"
}

export type SelectNationalPartiesParams = {
  [k in SelectNationalPartiesParamsKeys]?: string[]
};

export const SELECT_NATIONAL_PARTIES : SqlEntry<SelectNationalPartiesParams> = ({
  countries = [],
  euFractions= []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT
      ${NationalPartiesColumns.Party} AS "${Tables.NationalParties}"
    FROM ${tables(SELECT_NATIONAL_PARTIES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
      ${euFractions.length > 0
        ? `${MepsColumns.EuFraction} IN (${quoteJoin(euFractions)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${countries.length > 0
        ? `${NationalPartiesColumns.Country} IN (${quoteJoin(countries)})`
        : "TRUE"
      }${" "}
    ORDER BY ${NationalPartiesColumns.Party} ASC`;
  /* eslint-enable indent */


export const SELECT_MEPS_COLUMNS : TableColumn[] = [
  {
    table: Tables.Meps,
    column: MepsColumns.MepId
  },
  {
    table: Tables.Meps,
    column: MepsColumns.Name
  },
  {
    table: Tables.Meps,
    column: MepsColumns.EuFraction
  },
  {
    table: Tables.NationalParties,
    column: NationalPartiesColumns.Party
  },
  {
    table: Tables.Emails,
    column: EmailsColumns.Email
  }
];

export const SELECT_MEPS_TABLES : Tables[] = [Tables.Meps, Tables.NationalParties, Tables.Emails];

export enum SelectMepsParamsKeys {
  MepIds = "mepIds",
  Countries = "countries",
  NationalParties = "nationalParties",
  EuFractions = "euFractions"
}

export type SelectMepsParams = {
  [k in SelectMepsParamsKeys]?: string[]
};

export const SELECT_MEPS : SqlEntry<SelectMepsParams> = ({
  mepIds = [],
  countries = [],
  nationalParties = [],
  euFractions = []
}) =>
  /* eslint-disable indent */
  `SELECT ${columns(SELECT_MEPS_COLUMNS)}${" "}
    FROM ${tables(SELECT_MEPS_TABLES)}${" "}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Emails, EmailsColumns.MepId)}${" "}
    AND${" "}
      ${tableColumn(Tables.Emails, EmailsColumns.Email)} IN (
        SELECT e.${EmailsColumns.Email}
        FROM ${Tables.Emails} AS e
        WHERE e.${EmailsColumns.MepId} = ${tableColumn(Tables.Emails, EmailsColumns.MepId)} LIMIT 1
      )${" "}
    AND${" "}
      ${mepIds.length > 0
        ? `${tableColumn(Tables.Meps, MepsColumns.MepId)} IN (${quoteJoin(mepIds)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${countries.length > 0
        ? `${NationalPartiesColumns.Country} IN (${quoteJoin(countries)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${nationalParties.length > 0
        ? `${NationalPartiesColumns.Party} IN (${quoteJoin(nationalParties)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${euFractions.length > 0
        ? `${MepsColumns.EuFraction} IN (${quoteJoin(euFractions)})`
        : "TRUE"
      }${" "}
    ORDER BY ${MepsColumns.Name} ASC`;
  /* eslint-enable indent */
