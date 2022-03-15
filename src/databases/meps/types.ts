import { Table } from "../types";

export enum EmailsColumns {
  MepId = "mep_id",
  Email = "email"
}

export type Emails = Table<EmailsColumns>;

export enum MepsColumns {
  MepId = "mep_id",
  Name = "name",
  EuFraction = "eu_fraction",
  NationalPartyId = "national_party_id"
}

export type Meps = Table<MepsColumns>;

export enum NationalPartiesColumns {
  NationalPartyId = "national_party_id",
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
