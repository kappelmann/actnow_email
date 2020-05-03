import { accessorsFromEntries } from "../utils";

export type Column = {
  accessor: string,
  display: string
};

export type Table = {
  accessor: string,
  display: string,
  columns: { [key: string]: Column }
};

export const MEPS : Table = {
  accessor: "meps",
  display: "MEPs",
  columns: {
    name: {
      accessor: "name",
      display: "Name"
    },
    country: {
      accessor: "nation",
      display: "Country"
    },
    euFraction: {
      accessor: "eu_fraction",
      display: "EU fraction"
    },
    nationalParty: {
      accessor: "national_party",
      display: "National party"
    }
  }
};

export type Schema = {
  [key: string]: Table
};

export const SCHEMA : Schema = {
  meps: MEPS
};

export type SqlEntry<P extends object> = {
  sql: (params : P) => string,
  columns: Column[]
};


const SELECT_COUNTRIES_COLUMNS = [MEPS.columns.country];
const SELECT_COUNTRIES_TABLES = [MEPS];

export type SelectCountriesParams = {};

export const SELECT_COUNTRIES : SqlEntry<SelectCountriesParams> = {
  sql: () => `SELECT DISTINCT ${accessorsFromEntries(SELECT_COUNTRIES_COLUMNS)}
    FROM ${accessorsFromEntries(SELECT_COUNTRIES_TABLES)}
    ORDER BY ${MEPS.columns.country.accessor} ASC`,
  columns: SELECT_COUNTRIES_COLUMNS
};


const SELECT_EU_FRACTIONS_COLUMNS = [MEPS.columns.euFraction];
const SELECT_EU_FRACTIONS_TABLES = [MEPS];

export type SelectFractionsParams = {};
export const SELECT_EU_FRACTIONS : SqlEntry<SelectFractionsParams> = {
  sql: () => `SELECT DISTINCT ${accessorsFromEntries(SELECT_EU_FRACTIONS_COLUMNS)}
    FROM ${accessorsFromEntries(SELECT_EU_FRACTIONS_TABLES)}
    ORDER BY ${MEPS.columns.euFraction.accessor} ASC`,
  columns: SELECT_COUNTRIES_COLUMNS
};


const SELECT_NATIONAL_PARTIES_COLUMNS = [MEPS.columns.nationalParty];
const SELECT_NATIONAL_PARTIES_TABLES = [MEPS];

export type SelectNationalPartiesParams = {};

export const SELECT_NATIONAL_PARTIES : SqlEntry<SelectNationalPartiesParams> = {
  sql: () => `SELECT DISTINCT ${accessorsFromEntries(SELECT_NATIONAL_PARTIES_COLUMNS)}
    FROM ${accessorsFromEntries(SELECT_NATIONAL_PARTIES_TABLES)}
    ORDER BY ${MEPS.columns.nationalParty.accessor} ASC`,
  columns: SELECT_COUNTRIES_COLUMNS
};


const SELECT_MEPS_COLUMNS = [MEPS.columns.name, MEPS.columns.country, MEPS.columns.nationalParty, MEPS.columns.euFraction];
const SELECT_MEPS_TABLES = [MEPS];

export type SelectMepsParams = {
  countries?: string[]
};

export const SELECT_MEPS : SqlEntry<SelectMepsParams> = {
  sql: ({
    countries = []
  }) =>
  /* eslint-disable indent */
  `SELECT ${accessorsFromEntries(SELECT_MEPS_COLUMNS)}
    FROM ${accessorsFromEntries(SELECT_MEPS_TABLES)}
    ${countries.length > 0
      ? `WHERE ${MEPS.columns.country.accessor} IN (${countries.map((country) => `"${country}"`).join(",")})`
      : ""
    };`,
  /* eslint-enable indent */
  columns: SELECT_MEPS_COLUMNS
};
