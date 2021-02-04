import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { RESOURCES } from "./consts";
import { COUNTRY_CODES as COUNTRY_CODES_EN } from "./en";

i18n
// detect user language
.use(LanguageDetector)
// pass the i18n instance to react-i18next.
.use(initReactI18next)
// init i18next
// for all options read: https://www.i18next.com/overview/configuration-options
.init({
  resources: RESOURCES,
  fallbackLng: COUNTRY_CODES_EN.EN,
  // debug: true,
  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  }
});

export default i18n;
