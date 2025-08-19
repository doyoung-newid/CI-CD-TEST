import { useCallback, useEffect, useState } from 'react';
import { deleteRelevance, fetchRelevance, insertRelevance, upsertRelevance } from '@/api/service/relevance.ts';
import { RelevanceItem, RelevanceLocalized, RelevanceTranslationItem } from '@/api/model/relevance.ts';
import { useQueryClient } from '@tanstack/react-query';
import { loadingState, QueryKeys } from '@/store';
import { useSetAtom } from 'jotai';

function useRelevance() {
    const setLoading = useSetAtom(loadingState);
    const queryClient = useQueryClient();
    const [list, setList] = useState<RelevanceItem[]>([]);
    const [filteredList, setFilteredList] = useState<RelevanceItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const insertFn = useCallback(
        async (data: RelevanceLocalized) => {
            const result = await insertRelevance(data);
            await queryClient.resetQueries([QueryKeys.RELEVANCE]);
            if (result) {
                setList((prev) => sortByName([...prev, result]));
            } else {
                return data.en;
            }
        },
        [queryClient],
    );

    const updateFn = useCallback(
        async (relevance: RelevanceTranslationItem) => {
            const result = await upsertRelevance(relevance.name, relevance.id, relevance.lang);
            if (result) {
                await queryClient.resetQueries([QueryKeys.RELEVANCE]);
                return true;
            } else {
                return false;
            }
        },
        [list],
    );

    const deleteFn = useCallback(async (id: number) => {
        setLoading(true);
        const result = await deleteRelevance(id);
        if (result) {
            setList((prev) => {
                return prev.filter((item) => item.id !== id);
            });
            await queryClient.resetQueries([QueryKeys.RELEVANCE]);
        }
        setLoading(false);
        return result;
    }, []);

    useEffect(() => {
        setFilteredList(filterData(list, searchTerm));
    }, [list, searchTerm]);

    useEffect(() => {
        fetchRelevance().then((result) => setList(result));
    }, []);

    return {
        filteredList,
        searchTerm,
        insertFn,
        updateFn,
        deleteFn,
        setSearchTerm,
    };
}
export default useRelevance;

const sortByName = (items: RelevanceItem[]) => {
    return [...items].sort((a, b) => a.name.en.localeCompare(b.name.en));
};

const filterData = (data: RelevanceItem[], searchTerm: string) => {
    if (!searchTerm || !searchTerm.trim()) {
        return data;
    }

    const lowercasedSearchTerm = searchTerm.toLowerCase();

    return data.filter((item) => {
        const nameValues = Object.values(item.name);

        return nameValues.some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedSearchTerm),
        );
    });
};
