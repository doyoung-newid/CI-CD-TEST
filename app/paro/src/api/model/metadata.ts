import { LanguageCode, WeightScore } from '@/types/enums.ts';

export type MetadataItem = {
    contentId: string;
    contentType: string;
    categoryId: number;
    categoryWeight: number;
    categoryName: string;
    updatedDate: string;
    relevance: MetadataRelevance[];
    tag: MetadataTag[];
};

export type MetadataRelevance = {
    id: number;
    weight: number;
};

export type MetadataTag = {
    lang: LanguageCode;
    value: string;
};

export const InitMetadata: MetadataItem = {
    contentId: '',
    contentType: '',
    categoryId: -1,
    categoryWeight: 0,
    categoryName: '',
    updatedDate: '',
    relevance: [],
    tag: [],
};

export const InitMetadataRelevance: MetadataRelevance = {
    id: -1,
    weight: WeightScore[0].value,
};
