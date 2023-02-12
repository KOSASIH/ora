import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import LanguageDetector from 'i18next-browser-languagedetector'

import XHR from "i18next-http-backend"
import translationEN from "../en.json";
import translationVI from "../vi.json";
const resources = {
    en: {
        translation: translationEN,
    },
    vi: {
        translation: translationVI,
    },
};
i18n.use(XHR)
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(initReactI18next).init({
    resources,
    fallbackLng: "en",
    keySeparator: false,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
