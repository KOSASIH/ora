
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
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
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:"en",
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;