import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEN from './locals/EN/commonEN.json'
import commonBN from './locals/BN/commonBN.json'

const resources = {
    en: {
        translation: commonEN,
    },
    bn: {
        translation: commonBN,
    }
}

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });


export default i18n;