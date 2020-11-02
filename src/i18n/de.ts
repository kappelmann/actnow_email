import {
  EmailsColumns,
  NationalPartiesColumns,
  MepsColumns
} from "../database/types";

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

  "Add e-mail": "E-mail-Adresse hinzufügen",
  "Open e-mail client on link visit": "Öffne Mailprogramm bei Linkzugriff",
  "Alias already exists.": "Alias {{alias}} ist bereits vergeben.",
  "Short alias": "Kurzlink",
  "(Optional) Enter custom alias": "(Optional) Alias eingeben",
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
  "Create e-mail link and template": "Erstelle E-Mail Link und Vorlage",
  "Create link": "Erstelle Link",
  "Link copied to clipboard": "Link in Zwischenspeicher kopiert",
  "E-mail body": "E-Mail Text",
  "Subject": "Betreff",
  "Contact MEPs": "🇪🇺 Kontaktiere Mitglieder des europäischen Parlaments",
  "MEPs instructions": "Suche und wähle die Mitglieder des europäischen Parlament (MEPs), die du kontaktieren möchtest. Klicke anschließend den Knopf am Ende der Seite um dein E-Mail-Template zu erstellen.",
  "Almost Done": "Fast fertig",
  "Write mail instructions": "Erstelle deine E-Mail Vorlage. Wenn du fertig bist, drücke den Knopf unten um dein Mailprogramm zu öffnen. Du kannst auch einen Link erstellen, um deine Vorlage ganz einfach mit anderen zu teilen.",
  "Open e-mail client": "Öffne Mailprogramm",
  "Select MEPs in the table above": "Wähle MEPs in der Tabelle oben",
  "Missing selection instructions": "Jemand fehlt? Kein Problem. Geh einfach zurück und füge sie zur Liste hinzu.",
  "Enter more e-mail addresses here": "Füge weitere E-Mail-Adressen hier hinzu.",
  "No selection go back": "Uups, keine Auswahl vorhanden. Geh zurück und füge welche hinzu.",
  "Recipients": "Empfänger*innen",
  "Could not find specified database version": "Konnte die spezifizierte Datenbankversion nicht finden. Versuch den Versionsparameter in deiner URL zu entfernen.",
  "Could not load database version from server": "Konnte die Datenbank nicht vom Server laden.",
  "This website is open-source and available on": "Diese Platform ist open-source und verfügbar auf",
  "An initiative of the": "Eine Initiative des",
  "Last update of data": "Letztes Update der Daten",
  "Select and copy the URL": "Wähle und kopiere die URL",

  "entry": "Eintrag",
  "entry_plural": "Einträge",
  "entryWithCount": "{{count}} Einträge",
  "entryWithCount_plural": "{{count}} Einträge"
};
