import { SelectOption } from '@plitvice/ui';

export const Country = {
    US: 'US',
    KR: 'KR',
};
export type Country = (typeof Country)[keyof typeof Country];

export const Language: SelectOption[] = [
    { value: 'en', label: 'en (English)' },
    { value: 'ko', label: 'ko (한국어)' },
    { value: 'es', label: 'es (Español)' },
    { value: 'fr', label: 'fr (Français)' },
    { value: 'ja', label: 'ja (日本語)' },
    { value: 'cn', label: 'cn (中文)' },
];
export type LanguageCode = (typeof Language)[number]['value'];
export type LocalizedName = {
    [K in LanguageCode]?: string;
} & {
    en: string;
};
export const LanguageCodes: LanguageCode[] = Language.map((item) => item.value);

export const LegalType = {
    PRIVACY_POLICY: 'privacy',
    TERMS_OF_USE: 'terms',
    DO_NOT_SHARE: 'share',
};
export type LegalType = (typeof LegalType)[keyof typeof LegalType];

export const WeightScore: SelectOption[] = [
    { value: 1.0, label: '1.0' },
    { value: 0.9, label: '0.9' },
    { value: 0.8, label: '0.8' },
    { value: 0.7, label: '0.7' },
    { value: 0.6, label: '0.6' },
    { value: 0.5, label: '0.5' },
    { value: 0.4, label: '0.4' },
    { value: 0.3, label: '0.3' },
    { value: 0.2, label: '0.2' },
    { value: 0.1, label: '0.1' },
];
