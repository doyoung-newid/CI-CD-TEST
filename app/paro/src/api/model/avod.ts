import { Content } from '@/api/model/content.ts';

export type AvodData = {
    avod: AvodProgram[];
    series: AvodSeries[];
};

export interface AvodSeries extends Content {
    durationAvg: number;
}

export interface AvodProgram extends Content {
    no: number;
    duration: number;
    seriesId: string;
}
