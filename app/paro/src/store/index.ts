import { atom } from 'jotai';

export const QueryKeys = {
    CONTENT_ASSETS: 'contentAssets',
    METADATA: 'metadata',
    CATEGORY: 'category',
    RELEVANCE: 'relevance',
    LEGAL: 'legal',
} as const;
export type QueryKeys = (typeof QueryKeys)[keyof typeof QueryKeys];

export const loadingState = atom(false);
