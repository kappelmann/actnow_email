import {
  EmailsColumns,
  NationalPartiesColumns,
  MepsColumns,
} from "../databases/meps/types";

import { SELECT_MEPS_COLUMN_COMMITTEES } from "../databases/meps/sqls";
import URLS from "../consts/urls";

export const COUNTRY_CODES = {
  EN: "en"
};

export const TRANSLATIONS = {
  "date": "{{date, datetime}}",
  "Filter": "Filter",

  // database columns
  [MepsColumns.Name]: "Name",
  [NationalPartiesColumns.Party]: "National party",
  [MepsColumns.EuFraction]: "EU fraction",
  [NationalPartiesColumns.Country]: "Country",
  [EmailsColumns.Email]: "E-mail",
  [SELECT_MEPS_COLUMN_COMMITTEES]: "Committees",

  "Did you try our European parliament contact tool?": "Did you try our European parliament contact tool?",
  "Did you try our general-purpose contact tool?": "Did you try our general-purpose contact tool?",
  "Change language": "Change language",
  "Could not create SVG image": "Could not create SVG image.",
  "Save QR code": "Save QR code",
  "Press enter to add address": "Press enter to add address",
  "Open e-mail client on link visit": "Open e-mail client on link visit",
  "Check to automatically open e-mail client with template on link visit": "Check to automatically open e-mail client with template on link visit",
  "Alias already exists": "Alias \"{{alias}}\" already exists.",
  "Short link": "Short link",
  "(Optional) Enter custom link": "(Optional) Enter custom link",
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
  "Create e-mail template": "Create e-mail template",
  "Create link": "Create link",
  "Link copied to clipboard": "Link copied to clipboard",
  "E-mail body": "E-mail body",
  "Subject": "Subject",
  "Contact MEPs": "Contact Members of the European Parliament",
  "MEPs instructions": "Search and select the members of the European parliament that you wish to contact. Then click the button at the end of the page to create your e-mail template. You will even be able to share your template with others.",
  "Create your e-mail template": "Create your e-mail template",
  "Share template": "Share template",
  "Send via e-mail client": "Send via e-mail client",
  "Select MEPs in the table above": "Select MEPs in the table above",
  "Missing selection instructions": "Someone missing? No worries. Just go back and add them to the list.",
  "Enter valid e-mail address": "Enter valid e-mail address.",
  "Enter more addresses here": "Enter more addresses here",
  "No selection go back": "Oops, you have no selections. Head back to add some.",
  "Add e-mail addresses": "Add e-mail addresses",
  "Could not find specified database version": "Could not find specified database version. Try removing the version parameter in your URL.",
  "Could not load database version from server": "Could not load database version from server.",
  "This website is open-source and available on": "This website is open-source and available on",
  "An initiative of the": "An initiative of the",
  "Last update of data": "Last update of data: {{date, datetime}}",
  "Select and copy the URL": "Select and copy the URL",

  "entry": "entry",
  "entry_plural": "entries",
  "entryWithCount": "{{count}} entries",
  "entryWithCount_plural": "{{count}} entries",

  "shortAliasTooltip": `Example: "stop-coal" results in link "${URLS.SHORTEN_LINK_DOMAIN}/stop-coal"`
};
