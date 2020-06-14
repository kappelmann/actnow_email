import {
  EmailsColumns,
  NationalPartiesColumns,
  MepsColumns,
  RolesColumns,
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
export const SELECT_COUNTRIES_TABLES : Tables[] = [Tables.NationalParties, Tables.Meps, Tables.Roles];

export enum SelectCountriesParamsKeys {
  NationalParties = "nationalParties",
  EuFractions = "euFractions",
  Committees = "committees",
  Roles = "roles"
}

export type SelectCountriesParams = {
  [k in SelectCountriesParamsKeys]?: string[]
};

export const SELECT_COUNTRIES : SqlEntry<SelectCountriesParams> = ({
  nationalParties = [],
  euFractions = [],
  committees = [],
  roles = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_COUNTRIES_COLUMNS)}
    FROM ${tables(SELECT_COUNTRIES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Roles, RolesColumns.MepId)}${" "}
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
    AND${" "}
      ${committees.length > 0
        ? `${RolesColumns.Committee} IN (${quoteJoin(committees)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${roles.length > 0
        ? `${RolesColumns.Role} IN (${quoteJoin(roles)})`
        : "TRUE"
      }${" "}
    ORDER BY ${NationalPartiesColumns.Country} ASC`;
  /* eslint-enable indent */

export const SELECT_EU_FRACTIONS_COLUMNS : TableColumn[] = [{ table: Tables.Meps, column: MepsColumns.EuFraction }];
export const SELECT_EU_FRACTIONS_TABLES : Tables[] = [Tables.Meps, Tables.NationalParties, Tables.Roles];

export enum SelectEuFractionsParamsKeys {
  Countries = "countries",
  NationalParties = "nationalParties",
  Committees = "committees",
  Roles = "roles"
}

export type SelectEuFractionsParams = {
  [k in SelectEuFractionsParamsKeys]?: string[]
};

export const SELECT_EU_FRACTIONS : SqlEntry<SelectEuFractionsParams> = ({
  countries = [],
  nationalParties = [],
  committees = [],
  roles = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_EU_FRACTIONS_COLUMNS)}
    FROM ${tables(SELECT_EU_FRACTIONS_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Roles, RolesColumns.MepId)}${" "}
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
    AND${" "}
      ${committees.length > 0
        ? `${RolesColumns.Committee} IN (${quoteJoin(committees)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${roles.length > 0
        ? `${RolesColumns.Role} IN (${quoteJoin(roles)})`
        : "TRUE"
      }${" "}
    ORDER BY ${MepsColumns.EuFraction} ASC`;
  /* eslint-enable indent */


export const SELECT_NATIONAL_PARTIES_TABLES : Tables[] = [Tables.NationalParties, Tables.Meps, Tables.Roles];

export enum SelectNationalPartiesParamsKeys {
  Countries = "countries",
  EuFractions = "euFractions",
  Committees = "committees",
  Roles = "roles"
}

export type SelectNationalPartiesParams = {
  [k in SelectNationalPartiesParamsKeys]?: string[]
};

export const SELECT_NATIONAL_PARTIES : SqlEntry<SelectNationalPartiesParams> = ({
  countries = [],
  euFractions= [],
  committees = [],
  roles = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT
      ${NationalPartiesColumns.Party} AS "${Tables.NationalParties}"
    FROM ${tables(SELECT_NATIONAL_PARTIES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Roles, RolesColumns.MepId)}${" "}
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
    AND${" "}
      ${committees.length > 0
        ? `${RolesColumns.Committee} IN (${quoteJoin(committees)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${roles.length > 0
        ? `${RolesColumns.Role} IN (${quoteJoin(roles)})`
        : "TRUE"
      }${" "}
    ORDER BY ${NationalPartiesColumns.Party} ASC`;
  /* eslint-enable indent */

export const SELECT_COMMITTEES_COLUMNS : TableColumn[] = [{ table: Tables.Roles, column: RolesColumns.Committee }];
export const SELECT_COMMITTEES_TABLES : Tables[] = [Tables.Roles, Tables.Meps, Tables.NationalParties];

export enum SelectCommitteesParamsKeys {
  NationalParties = "nationalParties",
  Countries = "countries",
  EuFractions = "euFractions",
  Roles = "roles"
}

export type SelectCommitteesParams = {
  [k in SelectCommitteesParamsKeys]?: string[]
};

export const SELECT_COMMITTEES : SqlEntry<SelectCommitteesParams> = ({
  nationalParties = [],
  countries = [],
  euFractions= [],
  roles = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_COMMITTEES_COLUMNS)}
    FROM ${tables(SELECT_COMMITTEES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Roles, RolesColumns.MepId)}${" "}
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
    AND${" "}
      ${nationalParties.length > 0
        ? `${NationalPartiesColumns.Party} IN (${quoteJoin(nationalParties)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${roles.length > 0
        ? `${RolesColumns.Role} IN (${quoteJoin(roles)})`
        : "TRUE"
      }${" "}
    ORDER BY ${RolesColumns.Committee} ASC`;
  /* eslint-enable indent */

export const SELECT_ROLES_COLUMNS : TableColumn[] = [{ table: Tables.Roles, column: RolesColumns.Role }];
export const SELECT_ROLES_TABLES : Tables[] = [Tables.Roles, Tables.Meps, Tables.NationalParties];

export enum SelectRolesParamsKeys {
  NationalParties = "nationalParties",
  Countries = "countries",
  EuFractions = "euFractions",
  Committees = "committees"
}

export type SelectRolesParams = {
  [k in SelectRolesParamsKeys]?: string[]
};

export const SELECT_ROLES : SqlEntry<SelectRolesParams> = ({
  nationalParties = [],
  countries = [],
  euFractions= [],
  committees = []
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_ROLES_COLUMNS)}
    FROM ${tables(SELECT_ROLES_TABLES)}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Roles, RolesColumns.MepId)}${" "}
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
    AND${" "}
      ${nationalParties.length > 0
        ? `${NationalPartiesColumns.Party} IN (${quoteJoin(nationalParties)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${committees.length > 0
        ? `${RolesColumns.Committee} IN (${quoteJoin(committees)})`
        : "TRUE"
      }${" "}
    ORDER BY ${RolesColumns.Role} ASC`;
  /* eslint-enable indent */


export const SELECT_MEPS_TABLES : Tables[] = [Tables.Meps, Tables.NationalParties, Tables.Emails, Tables.Roles];

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

export enum SelectMepsParamsKeys {
  MepIds = "mepIds",
  Countries = "countries",
  NationalParties = "nationalParties",
  EuFractions = "euFractions",
  Committees = "committees",
  Roles = "roles",
  Filter = "filter"
}

export type SelectMepsParams = {
  [SelectMepsParamsKeys.Filter]?: string
} & {
  [k in Exclude<SelectMepsParamsKeys, SelectMepsParamsKeys.Filter>]?: string[]
};

export const SELECT_MEPS : SqlEntry<SelectMepsParams> = ({
  mepIds = [],
  countries = [],
  nationalParties = [],
  euFractions = [],
  committees = [],
  roles = [],
  filter
}) =>
  /* eslint-disable indent */
  `SELECT DISTINCT ${columns(SELECT_MEPS_COLUMNS)}${" "}
    FROM ${tables(SELECT_MEPS_TABLES)}${" "}
    WHERE${" "}
        ${tableColumn(Tables.Meps, MepsColumns.NationalPartyId)}
      = ${tableColumn(Tables.NationalParties, NationalPartiesColumns.NationalPartyId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Emails, EmailsColumns.MepId)}${" "}
    AND${" "}
        ${tableColumn(Tables.Meps, MepsColumns.MepId)}
      = ${tableColumn(Tables.Roles, RolesColumns.MepId)}${" "}
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
    AND${" "}
      ${committees.length > 0
        ? `${RolesColumns.Committee} IN (${quoteJoin(committees)})`
        : "TRUE"
      }${" "}
    AND${" "}
      ${roles.length > 0
        ? `${RolesColumns.Role} IN (${quoteJoin(roles)})`
        : "TRUE"
      }${" "}
    AND${"( "}
      UPPER(${tableColumn(Tables.Meps, MepsColumns.Name)}) LIKE UPPER("%${filter}%") OR
      UPPER(${tableColumn(Tables.Meps, MepsColumns.EuFraction)}) LIKE UPPER("%${filter}%") OR
      UPPER(${tableColumn(Tables.NationalParties, NationalPartiesColumns.Party)}) LIKE UPPER("%${filter}%") OR
      UPPER(${tableColumn(Tables.Emails, EmailsColumns.Email)}) LIKE UPPER("%${filter}%")
      ${") "}
    ORDER BY ${tableColumn(Tables.Meps, MepsColumns.Name)} ASC`;
  /* eslint-enable indent */

