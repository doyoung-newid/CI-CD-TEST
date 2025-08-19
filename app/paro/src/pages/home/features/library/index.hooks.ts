import { useCallback, useEffect, useState } from 'react';
import { ContentType } from '@/types/common.ts';
import { useAtomValue } from 'jotai';
import { contentAssetsAtom } from '@/store/app.ts';
import { SelectOption } from '@plitvice/ui';
import { fetchMetadata } from '@/api/service/metadata.ts';
import { Content } from '@/api/model/content.ts';
import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/store';
import { MetadataItem } from '@/api/model/metadata.ts';

type UseLibraryProps = {
    contentType?: string;
};

function useLibrary({ contentType }: UseLibraryProps) {
    const [titleKey, setTitleKey] = useState<string>();
    const [contentList, setContentList] = useState<Content[]>([]);
    const [filteredList, setFilteredList] = useState<Content[]>([]);
    const [searchFilter, setSearchFilter] = useState(LibrarySearchFilterList[0].value);
    const [searchKey, setSearchKey] = useState('');
    const contentAssets = useAtomValue(contentAssetsAtom);

    const { data: metadataList = [], isLoading: isMetadataLoading } = useQuery({
        queryKey: [QueryKeys.METADATA],
        queryFn: () => fetchMetadata(contentType as ContentType),
        staleTime: 1000 * 60 * 60,
    });

    const metadataUpdateFn = useCallback((metadata: MetadataItem) => {
        setContentList((prev) => {
            const item = prev.find((content) => content.contentId === metadata.contentId);
            if (item) {
                item.metadata = metadata;
            }
            return prev;
        });
    }, []);

    const handleFilter = useCallback((item: Content, filterKey: string, filterType?: string) => {
        if (filterType === LibrarySearchFilterList[0].value) {
            return (
                item.contentId.toLowerCase().includes(filterKey.toLowerCase()) ||
                item.title.toLowerCase().includes(filterKey.toLowerCase())
            );
        } else if (filterType === LibrarySearchFilterList[1].value) {
            return item.contentId.toLowerCase().includes(filterKey.toLowerCase());
        } else if (filterType === LibrarySearchFilterList[2].value) {
            return item.title.toLowerCase().includes(filterKey.toLowerCase());
        } else {
            return true;
        }
    }, []);

    useEffect(() => {
        setFilteredList(contentList.filter((item: Content) => handleFilter(item, searchKey, searchFilter)));
    }, [contentList, handleFilter, searchFilter, searchKey]);

    useEffect(() => {
        if (!isMetadataLoading) {
            let list: Content[] = [];
            switch (contentType) {
                case ContentType.LINEAR:
                    setTitleKey('nav.channel');
                    list = contentAssets.linear;
                    break;
                case ContentType.SERIES:
                    setTitleKey('nav.series');
                    list = contentAssets.series;
                    break;
                case ContentType.PROGRAM:
                    setTitleKey('nav.program');
                    list = contentAssets.program.filter((item) => !item.seriesId);
                    break;
            }
            list.map((content) => {
                const metadata = metadataList.find((metadata) => metadata.contentId === content.contentId);
                if (metadata) {
                    content.metadata = metadata;
                }
            });

            setContentList(list);
        }
    }, [contentType, contentAssets, metadataList, isMetadataLoading]);

    return {
        titleKey,
        filteredList,
        searchFilter,
        searchKey,
        setSearchFilter,
        setSearchKey,
        metadataUpdateFn,
    };
}
export default useLibrary;

export const LibrarySearchFilterList: SelectOption[] = [
    { value: 'all', label: 'All' },
    { value: 'id', label: 'ID' },
    { value: 'title', label: 'Title' },
];
