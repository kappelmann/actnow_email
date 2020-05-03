import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import {
  COUNTRY_CODES,
  TRANSLATIONS as TRANSLATIONS_EN
} from "./en";

// the translations
const resources = {
  [COUNTRY_CODES.EN]: { translation: TRANSLATIONS_EN }
};

i18n
// detect user language
.use(LanguageDetector)
// pass the i18n instance to react-i18next.
.use(initReactI18next)
// init i18next
// for all options read: https://www.i18next.com/overview/configuration-options
.init({
  resources,
  fallbackLng: COUNTRY_CODES.EN,
  // debug: true,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  }
});

export default i18n;
