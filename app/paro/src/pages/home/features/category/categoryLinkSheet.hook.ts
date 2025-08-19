import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { LinearData } from '@/api/model/linear.ts';
import { AvodProgram, AvodSeries } from '@/api/model/avod.ts';
import { linearAtom, programAtom, seriesAtom } from '@/store/app.ts';
import { CategoryContentType, CategoryItem, CategoryLink } from '@/api/model/category.ts';
import { Content } from '@/types/common.ts';

type LinkedContent<T extends Content> = T & { weight: number };

export type LinkedLinear = LinkedContent<LinearData>;
export type LinkedAvod = LinkedContent<AvodProgram | AvodSeries>;

export interface LinkedContents {
    linear: LinkedLinear[];
    avod: LinkedAvod[];
}

type Result = {
    categoryLinks: CategoryLink[];
    contents: LinkedContents;
};

const useCategoryLinks = (category?: CategoryItem): Result => {
    const categoryLinks = category?.link ?? [];

    const linearList = useAtomValue(linearAtom);
    const seriesList = useAtomValue(seriesAtom);
    const programList = useAtomValue(programAtom);

    const linearLinks = categoryLinks.filter((link) => link.contentType === CategoryContentType.LINEAR);
    const linearContents = useMemo(
        () => sortByWeightAndTitle(mapLinksToContents(linearLinks, linearList)),
        [linearLinks, linearList],
    );

    const avodLinks = categoryLinks.filter((link) => link.contentType === CategoryContentType.AVOD);
    const avodContents = useMemo(() => {
        const seriesContents = mapLinksToContents(avodLinks, seriesList);
        const programContents = mapLinksToContents(avodLinks, programList);
        return sortByWeightAndTitle([...seriesContents, ...programContents]);
    }, [avodLinks, seriesList, programList]);

    return {
        categoryLinks,
        contents: {
            linear: linearContents,
            avod: avodContents,
        },
    };
};

export default useCategoryLinks;

function isLinkedContent<T extends Content>(item: LinkedContent<T> | null): item is LinkedContent<T> {
    return item !== null;
}

function mapLinksToContents<T extends Content>(links: CategoryLink[], contents: T[]): LinkedContent<T>[] {
    return links
        .map((link) => {
            const content = contents.find((item) => item.contentId === link.contentId);
            return content ? { ...content, weight: link.weight } : null;
        })
        .filter(isLinkedContent);
}

function sortByWeightAndTitle<T extends Content>(items: LinkedContent<T>[]): LinkedContent<T>[] {
    return [...items].sort((a, b) => {
        if (b.weight !== a.weight) return b.weight - a.weight;
        return a.title.localeCompare(b.title);
    });
}
