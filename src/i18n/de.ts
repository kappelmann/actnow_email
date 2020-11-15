import {
  EmailsColumns,
  NationalPartiesColumns,
  MepsColumns
} from "../database/types";

import { SELECT_MEPS_COLUMN_COMMITTEES } from "../database/sqls";
import URLS from "../consts/urls";

export const COUNTRY_CODES = {
  DE: "de"
};

export const TRANSLATIONS = {
  "Filter": "Filter",

  // database columns
  [MepsColumns.Name]: "Name",
  [NationalPartiesColumns.Party]: "Nationale Partei",
  [MepsColumns.EuFraction]: "EU-Fraktion",
  [NationalPartiesColumns.Country]: "Land",
  [EmailsColumns.Email]: "E-Mail",
  [SELECT_MEPS_COLUMN_COMMITTEES]: "Kommissionen",

  "Could not create SVG image": "Konnte SVG-Bild nicht erstellen.",
  "Save QR code": "Speicher QR-Code",
  "Press enter to add address": "Drücke Enter, um die Adresse hinzuzufügen",
  "Open e-mail client on link visit": "Öffne Mailprogramm bei Linkzugriff",
  "Check to automatically open e-mail client with template on link visit": "Auswählen, um automatisch Mailprogramm mit Vorlage bei Linkbesuch zu öffnen",
  "Alias already exists": "Alias \"{{alias}}\" ist bereits vergeben.",
  "Short link": "Kurzlink",
  "(Optional) Enter custom link": "(Optional) Link eingeben",
  "Add": "Hinzufügen",
  "Copy": "Kopieren",
  "Copy link": "Kopiere Link",
  "To": "An",
  "Cc": "Cc",
  "Bcc": "Bcc",
  "Back and Forward": "Zurück und Vorwärts",
  "Back": "Zurück",
  "Link will be shown here": "Link wird hier angezeigt",
  "Back to recipient selection": "Zurück zur Empfängerauswahl",
  "Entries per page": "Einträge pro Seite",
  "Go to page": "Gehe zu Seite",
  "Select countries": "Länderauswahl",
  "Select EU fractions": "EU-Fraktionsauswahl",
  "Select national parties": "Auswahl nationale Partei",
  "Select committees": "Kommissionsauswahl",
  "Select roles": "Rollenauswahl",
  "Search": "Suche",
  "Select": "Auswahl",
  "Submit": "Absenden",
  "Filters": "Filter",
  "Recipients type": "Empfängertyp",
  "Create e-mail template": "Erstelle E-Mail-Vorlage",
  "Create link": "Erstelle Link",
  "Link copied to clipboard": "Link in Zwischenspeicher kopiert",
  "E-mail body": "E-Mail Text",
  "Subject": "Betreff",
  "Contact MEPs": "Kontaktiere Mitglieder des europäischen Parlaments",
  "MEPs instructions": "Suche und wähle die Mitglieder des europäischen Parlaments, die du kontaktieren möchtest. Klicke dann den Knopf am Ende der Seite, um deine E-Mail-Vorlage zu erstellen. Du kannst deine Vorlage dann auch ganz einfach mit anderen teilen.",
  "Create your e-mail template": "Erstelle deine E-Mail-Vorlage",
  "Share template": "Vorlage teilen",
  "Send via e-mail client": "Senden via Mailprogramm",
  "Select MEPs in the table above": "Wähle MEPs in der Tabelle oben",
  "Missing selection instructions": "Jemand fehlt? Kein Problem. Geh einfach zurück und füge sie zur Liste hinzu.",
  "Enter valid e-mail address": "Gib eine valide E-Mail-Adresse ein",
  "Enter more e-mail addresses here": "Füge weitere E-Mail-Adressen hier hinzu",
  "No selection go back": "Uups, keine Auswahl vorhanden. Geh zurück und füge welche hinzu.",
  "Add e-mail addresses": "E-Mail-Adressen hinzufügen",
  "Could not find specified database version": "Konnte die spezifizierte Datenbankversion nicht finden. Versuch den Versionsparameter in deiner URL zu entfernen.",
  "Could not load database version from server": "Konnte die Datenbank nicht vom Server laden.",
  "This website is open-source and available on": "Diese Plattform ist open-source und verfügbar auf",
  "An initiative of the": "Eine Initiative des",
  "Last update of data": "Letztes Update der Daten",
  "Select and copy the URL": "Wähle und kopiere die URL",

  "entry": "Eintrag",
  "entry_plural": "Einträge",
  "entryWithCount": "{{count}} Einträge",
  "entryWithCount_plural": "{{count}} Einträge",

  "shortAliasTooltip": `Beispiel: "kohle-stopp" resultiert in Link "${URLS.SHORTEN_LINK_DOMAIN}/kohle-stopp"`
};
