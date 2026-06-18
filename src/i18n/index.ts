import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ko from "./locales/ko.json";
import en from "./locales/en.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ko: { translation: ko },
      en: { translation: en },
    },
    fallbackLng: "en",
    supportedLngs: ["ko", "en"],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "gbgr.lang",
      caches: ["localStorage"],
    },
  });

i18n.on("languageChanged", (language) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = language.startsWith("ko") ? "ko" : "en";
});

export default i18n;
