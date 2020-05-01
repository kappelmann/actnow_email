import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import {
  COUNTRY_CODE as EN_COUNTRY_CODE,
  TRANSLATIONS as EN_TRANSLATIONS
} from "./en";

// the translations
const resources = {
  [EN_COUNTRY_CODE]: { translation: EN_TRANSLATIONS }
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
  fallbackLng: EN_COUNTRY_CODE,
  // debug: true,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  }
});

export default i18n;
