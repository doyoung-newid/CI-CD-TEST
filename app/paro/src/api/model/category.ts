type LocalizedName = {
    [lang: string]: string;
};

export const CategoryContentType = {
    LINEAR: 'linear',
    AVOD: 'avod',
};
export type CategoryContentType = (typeof CategoryContentType)[keyof typeof CategoryContentType];

export type CategoryLink = {
    contentId: string;
    contentType: string;
    weight: number;
};

export type CategoryItem = {
    id: number;
    name: LocalizedName;
    orderSeq: number;
    link: CategoryLink[];
};

export type CategoryTranslationItem = {
    id: number;
    name: string;
    lang: string;
};
