import { LanguageCode } from '@/types/enums.ts';

export type RelevanceItem = {
    id: number;
    name: RelevanceLocalized;
};

export type RelevanceLocalized = {
    [K in LanguageCode]?: string;
} & {
    en: string;
};

export type RelevanceTranslationItem = {
    id: number;
    name: string;
    lang: LanguageCode;
};
