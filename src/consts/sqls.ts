import { accessorsFromEntries } from "../utils";

// TODO: fix all of this and auto-generate

export type Column = {
  accessor: string,
  display: string
};

export type Table = {
  accessor: string,
  display: string,
  columns: { [key: string]: Column }
};

export const MEPS_ROWS = {
  NAME: "name",
  COUNTRY: "nation",
  EU_FRACTION: "eu_fraction",
  NATIONAL_PARTY: "national_party"
};

export const MEPS : Table = {
  accessor: "meps",
  display: "MEPs",
  columns: {
    name: {
      accessor: MEPS_ROWS.NAME,
      display: "Name"
    },
    country: {
      accessor: MEPS_ROWS.COUNTRY,
      display: "Country"
    },
    euFraction: {
      accessor: MEPS_ROWS.EU_FRACTION,
      display: "EU fraction"
    },
    nationalParty: {
      accessor: MEPS_ROWS.NATIONAL_PARTY,
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
  countries?: string[],
  nationalParties?: string[],
  euFractions?: string[]
};

export const SELECT_MEPS : SqlEntry<SelectMepsParams> = {
  sql: ({
    countries = [],
    nationalParties = [],
    euFractions = []
  }) =>
  /* eslint-disable indent */
  `SELECT ${accessorsFromEntries(SELECT_MEPS_COLUMNS)}${" "}
    FROM ${accessorsFromEntries(SELECT_MEPS_TABLES)}${" "}
    WHERE${" "}
      ${countries.length > 0
        ? `${MEPS.columns.country.accessor} IN (${countries.map((country) => `"${country}"`).join(",")})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${nationalParties.length > 0
        ? `${MEPS.columns.nationalParty.accessor} IN (${nationalParties.map((nationalParty) => `"${nationalParty}"`).join(",")})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${euFractions.length > 0
        ? `${MEPS.columns.euFraction.accessor} IN (${euFractions.map((euFraction) => `"${euFraction}"`).join(",")})`
        : "TRUE"
      }${" "}
    `,
  /* eslint-enable indent */
  columns: SELECT_MEPS_COLUMNS
};
