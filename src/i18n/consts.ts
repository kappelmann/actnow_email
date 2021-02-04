import {
  COUNTRY_CODES as COUNTRY_CODES_DE,
  TRANSLATIONS as TRANSLATIONS_DE
} from "./de";

import {
  COUNTRY_CODES as COUNTRY_CODES_EN,
  TRANSLATIONS as TRANSLATIONS_EN
} from "./en";

export const LANGUAGES_TO_COUNTRIES = {
  [COUNTRY_CODES_DE.DE]: "DE",
  [COUNTRY_CODES_EN.EN]: "GB"
};

// the translations
export const RESOURCES = {
  [COUNTRY_CODES_EN.EN]: { translation: TRANSLATIONS_EN },
  [COUNTRY_CODES_DE.DE]: { translation: TRANSLATIONS_DE }
};
