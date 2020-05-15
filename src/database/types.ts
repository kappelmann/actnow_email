export enum Default {
  Empty = "",
  Null = "NULL"
}

export enum Key {
  Empty = "",
  Pri = "PRI"
}

export enum Null {
  No = "NO",
  Yes = "YES"
}

export enum Type {
  Integer = "INTEGER",
  Text = "TEXT"
}

export type Column = {
  Name: string;
  Index: boolean;
  Type: Type;
  Null: Null;
  Key: Key;
  Default: Default;
  Extra: string;
};

export type Table<Columns extends string> = {
  Name: string;
  Columns: Record<Columns, Column>
};

export enum EmailsColumns {
  MepId = "mep_id",
  Email = "email"
}

export type Emails = Table<EmailsColumns>;

export enum MepsColumns {
  MepId = "mep_id",
  Name = "name",
  EuFraction = "eu_fraction",
  NationalParty = "national_party"
}

export type Meps = Table<MepsColumns>;

export enum NationalPartiesColumns {
  Party = "party",
  Country = "country"
}

export type NationalParties = Table<NationalPartiesColumns>;

export enum RolesColumns {
  MepId = "mep_id",
  Committee = "committee",
  Role = "role"
}

export type Roles = Table<RolesColumns>;

export enum Tables {
  Meps = "meps",
  Emails = "emails",
  Roles = "roles",
  NationalParties = "national_parties"
}

export type Schema = {
  [Tables.Meps]: Meps;
  [Tables.Emails]: Emails;
  [Tables.Roles]: Roles;
  [Tables.NationalParties]: NationalParties;
};
