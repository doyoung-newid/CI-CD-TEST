import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Country } from '@/types/enums';
import { LinearData } from '@/api/model/linear.ts';
import { AvodProgram, AvodSeries } from '@/api/model/avod.ts';
import { ContentAssets } from '@/api/model/content.ts';

export const countryState = atomWithStorage<string>('countryState', Country.US);

export const contentAssetsState = atom({
    linear: [],
    series: [],
    program: [],
} as ContentAssets);
export const contentAssetsAtom = atom(
    (get) => get(contentAssetsState),
    (_, set, contentAssets: ContentAssets) => {
        set(contentAssetsState, contentAssets);
    },
);

export const linearState = atom<LinearData[]>([]);
export const linearAtom = atom(
    (get) => get(linearState),
    (_, set, linearList: LinearData[]) => {
        set(linearState, linearList);
    },
);

export const seriesState = atom<AvodSeries[]>([]);
export const seriesAtom = atom(
    (get) => get(seriesState),
    (_, set, data: AvodSeries[]) => {
        set(seriesState, data);
    },
);

export const programState = atom<AvodProgram[]>([]);
export const programAtom = atom(
    (get) => get(programState),
    (_, set, data: AvodProgram[]) => {
        set(programState, data);
    },
);
