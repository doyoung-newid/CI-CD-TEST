import { initReactI18next } from 'react-i18next';

import i18n, { InitOptions } from 'i18next';

import enCommon from './en/common.json';
import koCommon from './ko/common.json';

const resources = {
    en: {
        common: enCommon,
    },
    ko: {
        common: koCommon,
    },
};

export const locales = ['en', 'ko'] as const;
export const fallbackLng = 'en' as const;
export const namespaces = ['common'] as const;
export const defaultNS = 'common' as const;

const baseConfig: InitOptions = {
    defaultNS,
    fallbackLng,
    supportedLngs: [...locales],
    ns: [...namespaces],
    preload: [fallbackLng],
    load: 'languageOnly',
    fallbackNS: defaultNS,
    partialBundledLanguages: true,
    interpolation: {
        escapeValue: false,
        prefix: '{',
        suffix: '}',
    },
};

i18n.use(initReactI18next).init({
    ...baseConfig,
    resources,
    lng: 'en',
});

export default i18n;
