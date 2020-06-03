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
  [NationalPartiesColumns.Party]: "National party",
  "National party": "National party",
  [MepsColumns.EuFraction]: "EU fraction",
  "EU fraction": "EU fraction",
  [NationalPartiesColumns.Country]: "Country",
  "Country": "Country",

  "Back and Forward": "Back and Forward",
  "Back": "Back",
  "Create e-mail link": "Create e-mail link",
  "Entries per page": "Entries per page",
  "Go to page": "Go to page",
  "Select countries": "Select countries",
  "Select EU fractions": "Select EU fractions",
  "Select national parties": "Select national parties",
  "Search": "Search",
  "Submit": "Submit",
  "Options": "Options",
  "Create e-mail links": "Create e-mail links",
  "Make a Change": "Make a Change",
  "Meps instructions": "Search and select the members of the European parliament (MEPs) that you want to contact. When you are done, click the button at the end of the page.",
  "Get Ready For Action": "Get Ready For Action",
  "Click link instructions": "Click the link to open you e-mail client.",


  "record": "record",
  "record_plural": "records",
  "recordWithCount": "{{count}} record",
  "recordWithCount_plural": "{{count}} records"
};
