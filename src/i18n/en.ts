import {
  EmailsColumns,
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
  [NationalPartiesColumns.Party]: "National party",
  [MepsColumns.EuFraction]: "EU fraction",
  [NationalPartiesColumns.Country]: "Country",
  [EmailsColumns.Email]: "E-mail",


  "Back and Forward": "Back and Forward",
  "Back": "Back",
  "Create e-mail link": "Create e-mail link",
  "Entries per page": "Entries per page",
  "Go to page": "Go to page",
  "Select countries": "Select countries",
  "Select EU fractions": "Select EU fractions",
  "Select national parties": "Select national parties",
  "Select committees": "Select committees",
  "Select roles": "Select roles",
  "Selected MEPs": "Selected MEPs",
  "Search": "Search",
  "Select...": "Select...",
  "Submit": "Submit",
  "Options": "Options",
  "Create e-mail links": "Create e-mail links",
  "E-mail body": "E-mail body",
  "E-mail subject": "E-mail subject",
  "Contact MEPs": "Contact Members of the European Parliament",
  "MEPs instructions": "Search and select the members of the European parliament (MEPs) that you want to contact. When you are done, click the button at the end of the page.",
  "Almost Done...": "Almost Done...",
  "Write mail instructions": "You can create your e-mail template below. Once you are done, click the button below to open your e-mail client. This will also create a link that you can share with your friends! Just copy the URL from the adress bar once you clicked the button.",
  "Select MEPs in the table above": "Select MEPs in the table above",
  "Missing selection instructions": "Someone missing? No worries. Just go back and add them to the list.",
  "No selection go back": "Oops, you have no selections. Head back to add some.",
  "Your selections": "Your selections",
  "Could not find specified database version": "Could not find specified database version. Try removing the version parameter in your URL.",
  "Could not load database version from server": "Could not load database version from server.",

  "record": "record",
  "record_plural": "records",
  "recordWithCount": "{{count}} record",
  "recordWithCount_plural": "{{count}} records"
};
