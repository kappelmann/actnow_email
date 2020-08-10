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
  "Back to recipient selection": "Back to recipient selection",
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
  "Create e-mail link and template": "Create e-mail link and template",
  "Create link and copy to clipboard": "Create link and copy to clipboard",
  "Link copied to clipboard": "Link copied to clipboard",
  "E-mail body": "E-mail body",
  "E-mail subject": "E-mail subject",
  "Contact MEPs": "Contact Members of the European Parliament",
  "MEPs instructions": "Search and select the members of the European parliament (MEPs) that you want to contact. When you are done, click the button at the end of the page.",
  "Almost Done...": "Almost Done...",
  "Write mail instructions": "You can create your e-mail template below. Once you are done, click the button below to open your e-mail client. You can also share the template as a link with your friends! Simply click the other button below to copy the link to your clipboard.",
  "Open e-mail client": "Open e-mail client",
  "Select MEPs in the table above": "Select MEPs in the table above",
  "Missing selection instructions": "Someone missing? No worries. Just go back and add them to the list.",
  "No selection go back": "Oops, you have no selections. Head back to add some.",
  "E-mail recipients": "E-mail recipients",
  "Could not find specified database version": "Could not find specified database version. Try removing the version parameter in your URL.",
  "Could not load database version from server": "Could not load database version from server.",

  "entry": "entry",
  "entry_plural": "entries",
  "entryWithCount": "{{count}} entries",
  "entryWithCount_plural": "{{count}} entries"
};
