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

  "Add e-mail": "Add-email",
  "Open e-mail client on link visit": "Open e-mail client on link visit",
  "Alias already exists.": "Alias {{alias}} already exists.",
  "Short alias": "Short alias",
  "(Optional) Enter custom alias": "(Optional) Enter custom alias",
  "Add": "Add",
  "Copy": "Copy",
  "Copy link": "Copy link",
  "To": "To",
  "Cc": "Cc",
  "Bcc": "Bcc",
  "Back and Forward": "Back and Forward",
  "Back": "Back",
  "Link will be shown here": "Link will be shown here",
  "Back to recipient selection": "Back to recipient selection",
  "Entries per page": "Entries per page",
  "Go to page": "Go to page",
  "Select countries": "Select countries",
  "Select EU fractions": "Select EU fractions",
  "Select national parties": "Select national parties",
  "Select committees": "Select committees",
  "Select roles": "Select roles",
  "Search": "Search",
  "Select": "Select",
  "Submit": "Submit",
  "Filters": "Filters",
  "Recipients type": "Recipients type",
  "Create e-mail link and template": "Create e-mail link and template",
  "Create link": "Create link",
  "Link copied to clipboard": "Link copied to clipboard",
  "E-mail body": "E-mail body",
  "Subject": "Subject",
  "Contact MEPs": "🇪🇺 Contact Members of the European Parliament",
  "MEPs instructions": "Search and select the members of the European parliament (MEPs) that you want to contact. When you are done, click the button at the end of the page to create your e-mail template.",
  "Almost Done": "Almost Done",
  "Write mail instructions": "Create your e-mail template. Once you are done, click the button below to open your e-mail client. You can also create a link to share the template with others.",
  "Open e-mail client": "Open e-mail client",
  "Select MEPs in the table above": "Select MEPs in the table above",
  "Missing selection instructions": "Someone missing? No worries. Just go back and add them to the list.",
  "Enter more e-mail addresses here": "Enter more e-mail addresses here.",
  "No selection go back": "Oops, you have no selections. Head back to add some.",
  "Recipients": "Recipients",
  "Could not find specified database version": "Could not find specified database version. Try removing the version parameter in your URL.",
  "Could not load database version from server": "Could not load database version from server.",
  "This website is open-source and available on": "This website is open-source and available on",
  "An initiative of the": "An initiative of the",
  "Last update of data": "Last update of data",
  "Select and copy the URL": "Select and copy the URL",

  "entry": "entry",
  "entry_plural": "entries",
  "entryWithCount": "{{count}} entries",
  "entryWithCount_plural": "{{count}} entries"
};
