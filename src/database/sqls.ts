import {
  NationalPartiesColumns,
  MepsColumns,
  Tables
} from "./types";
import {
  columns,
  tables,
  tableColumn,
  quoteJoin
} from "./utils";

export type SqlEntry<P extends object> = (params : P) => string;

export const SELECT_COUNTRIES_COLUMNS : NationalPartiesColumns[] = [NationalPartiesColumns.Country];
export const SELECT_COUNTRIES_TABLES : Tables[] = [Tables.NationalParties, Tables.Meps];

export enum SelectCountriesParamsKeys {
  NationalParties = "national_parties",
  EuFractions = "eu_fractions"
}

export type SelectCountriesParams = {
  [k in SelectCountriesParamsKeys]?: string[]
};

export const SELECT_COUNTRIES : SqlEntry<SelectCountriesParams> = ({
  national_parties = [],
  eu_fractions = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_COUNTRIES_COLUMNS)}
    FROM ${tables(SELECT_COUNTRIES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalParty)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.Party)}${" "}
    AND${" "}
    ${eu_fractions.length > 0
        ? `${MepsColumns.EuFraction} IN (${quoteJoin(eu_fractions)})`
        : "TRUE"
      }${" "}
    AND${" "}
    ${national_parties.length > 0
        ? `${NationalPartiesColumns.Party} IN (${quoteJoin(national_parties)})`
        : "TRUE"
      }${" "}
    ORDER BY ${NationalPartiesColumns.Country} ASC`;
  /* eslint-enable indent */


export const SELECT_EU_FRACTIONS_COLUMNS : MepsColumns[] = [MepsColumns.EuFraction];
export const SELECT_EU_FRACTIONS_TABLES : Tables[] = [Tables.Meps, Tables.NationalParties];

export enum SelectEuFractionsParamsKeys {
  Countries = "countries",
  NationalParties = "national_parties"
}

export type SelectEuFractionsParams = {
  [k in SelectEuFractionsParamsKeys]?: string[]
};

export const SELECT_EU_FRACTIONS : SqlEntry<SelectEuFractionsParams> = ({
  countries = [],
  national_parties= []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_EU_FRACTIONS_COLUMNS)}
    FROM ${tables(SELECT_EU_FRACTIONS_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalParty)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.Party)}${" "}
    AND${" "}
      ${national_parties.length > 0
        ? `${MepsColumns.NationalParty} IN (${quoteJoin(national_parties)})`
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
  EuFractions = "eu_fractions"
}

export type SelectNationalPartiesParams = {
  [k in SelectNationalPartiesParamsKeys]?: string[]
};

export const SELECT_NATIONAL_PARTIES : SqlEntry<SelectNationalPartiesParams> = ({
  countries = [],
  eu_fractions= []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT
      ${NationalPartiesColumns.Party} AS "${Tables.NationalParties}"
    FROM ${tables(SELECT_NATIONAL_PARTIES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalParty)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.Party)}${" "}
    AND${" "}
      ${eu_fractions.length > 0
        ? `${MepsColumns.EuFraction} IN (${quoteJoin(eu_fractions)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${countries.length > 0
        ? `${NationalPartiesColumns.Country} IN (${quoteJoin(countries)})`
        : "TRUE"
      }${" "}
    ORDER BY ${NationalPartiesColumns.Party} ASC`;
  /* eslint-enable indent */


export const SELECT_MEPS_COLUMNS : (MepsColumns | NationalPartiesColumns)[] = [
  MepsColumns.MepId,
  MepsColumns.Name,
  MepsColumns.EuFraction,
  NationalPartiesColumns.Country,
  MepsColumns.NationalParty
];

export const SELECT_MEPS_TABLES : Tables[] = [Tables.Meps, Tables.NationalParties];

export enum SelectMepsParamsKeys {
  Countries = "countries",
  NationalParties = "national_parties",
  EuFractions = "eu_fractions"
}

export type SelectMepsParams = {
  [k in SelectMepsParamsKeys]?: string[]
};

export const SELECT_MEPS : SqlEntry<SelectMepsParams> = ({
  countries = [],
  national_parties = [],
  eu_fractions = []
}) =>
  /* eslint-disable indent */
  `SELECT ${columns(SELECT_MEPS_COLUMNS)}${" "}
    FROM ${tables(SELECT_MEPS_TABLES)}${" "}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalParty)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.Party)}${" "}
    AND${" "}
      ${countries.length > 0
        ? `${NationalPartiesColumns.Country} IN (${quoteJoin(countries)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${national_parties.length > 0
        ? `${MepsColumns.NationalParty} IN (${quoteJoin(national_parties)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${eu_fractions.length > 0
        ? `${MepsColumns.EuFraction} IN (${quoteJoin(eu_fractions)})`
        : "TRUE"
      }${" "}
    ORDER BY ${MepsColumns.Name} ASC`;
  /* eslint-enable indent */
