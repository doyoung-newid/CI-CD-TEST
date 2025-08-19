export const ContentType = {
    LINEAR: 'linear',
    SERIES: 'series',
    PROGRAM: 'program',
    DEEPLINK: 'deeplink',
};
export type ContentType = (typeof ContentType)[keyof typeof ContentType];
