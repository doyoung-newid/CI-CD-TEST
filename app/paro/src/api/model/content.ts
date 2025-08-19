import { MetadataItem } from '@/api/model/metadata.ts';
import { LinearData } from '@/api/model/linear.ts';
import { AvodProgram, AvodSeries } from '@/api/model/avod.ts';

export interface ContentAssets {
    linear: LinearData[];
    series: AvodSeries[];
    program: AvodProgram[];
}

export interface Content {
    contentId: string;
    title: string;
    description: string;
    thumbUrl: ContentThumb;
    metadata: MetadataItem;
}

export type ContentThumb = {
    wide: ContentThumbDetail;
    poster: ContentThumbDetail;
};

export type ContentThumbDetail = {
    large: string;
    base: string;
    small: string;
};
