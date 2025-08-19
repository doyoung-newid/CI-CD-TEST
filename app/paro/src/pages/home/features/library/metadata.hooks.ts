import { useCallback, useEffect, useState } from 'react';
import { InitMetadata, MetadataItem, MetadataRelevance, MetadataTag } from '@/api/model/metadata.ts';
import { upsertMetadata } from '@/api/service/metadata.ts';
import { Content } from '@/api/model/content.ts';
import { sortByLanguageOrder } from '@/utils/common.ts';

type Props = {
    content?: Content;
};

function useMetadata({ content }: Props) {
    const [metadata, setMetadata] = useState(InitMetadata);

    const updateFn = useCallback(async () => {
        if (metadata) {
            const result = await upsertMetadata(metadata);
            if (result) {
                return metadata;
            }
        }
    }, [metadata]);

    const categoryChangeFn = useCallback(
        (categoryId: number) =>
            setMetadata((prev) => {
                return { ...prev, categoryId: categoryId } as MetadataItem;
            }),
        [],
    );

    const categoryWeightChangeFn = useCallback(
        (categoryWeight: number) =>
            setMetadata((prev) => {
                return { ...prev, categoryWeight: categoryWeight } as MetadataItem;
            }),
        [],
    );

    const relevanceChangeFn = useCallback(
        (relevance: MetadataRelevance, isDelete: boolean) =>
            setMetadata((prev) => {
                const relevanceList = prev.relevance.filter((item) => item.id !== relevance.id) ?? [];
                if (!isDelete) {
                    relevanceList.push(relevance);
                }
                return {
                    ...prev,
                    relevance: relevanceList,
                } as MetadataItem;
            }),
        [],
    );

    const updatedDateChangeFn = useCallback(
        (updatedDate: string) =>
            setMetadata((prev) => {
                return { ...prev, updatedDate: updatedDate } as MetadataItem;
            }),
        [],
    );

    const tagChangeFn = useCallback(
        (tag: MetadataTag, isDelete: boolean) =>
            setMetadata((prev) => {
                const tagList = prev.tag.filter((item) => item.lang !== tag.lang) ?? [];
                if (!isDelete) {
                    tagList.push(tag);
                }
                return {
                    ...prev,
                    tag: sortByLanguageOrder(tagList),
                } as MetadataItem;
            }),
        [],
    );

    useEffect(() => {
        if (content?.metadata) {
            setMetadata(content.metadata);
        } else {
            setMetadata(InitMetadata);
        }
    }, [content]);

    return {
        metadata,
        updateFn,
        categoryChangeFn,
        categoryWeightChangeFn,
        relevanceChangeFn,
        updatedDateChangeFn,
        tagChangeFn,
        isModified: content?.metadata !== metadata,
    };
}
export default useMetadata;
