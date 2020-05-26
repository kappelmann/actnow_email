import {
  NationalPartiesColumns,
  MepsColumns
} from "../database/types";

export const COUNTRY_CODES = {
  EN: "en"
};

export const TRANSLATIONS = {
  "Filter": "Filter",

  // database columns
  [MepsColumns.Name]: "Name",
  "Name": "Name",
  [MepsColumns.NationalParty]: "National party",
  "National party": "National party",
  [MepsColumns.EuFraction]: "EU fraction",
  "EU fraction": "EU fraction",
  [NationalPartiesColumns.Country]: "Country",
  "Country": "Country",

  "Back and Forward": "Back and Forward",
  "Create e-mail link": "Create e-mail link",
  "Entries per page": "Entries per page",
  "Go to page": "Go to page",
  "Select countries": "Select countries",
  "Select EU fractions": "Select EU fractions",
  "Select national parties": "Select national parties",
  "Search": "Search",
  "Submit": "Submit",
  "Options": "Options",

  "record": "record",
  "record_plural": "records",
  "recordWithCount": "{{count}} record",
  "recordWithCount_plural": "{{count}} records"
};
