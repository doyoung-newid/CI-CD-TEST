import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from '@/store';
import { supabase } from '@/api/supabaseClient.ts';
import { RelevanceTranslationItem } from '@/api/model/relevance.ts';
import { SelectOption } from '@plitvice/ui';
import { CategoryTranslationItem } from '@/api/model/category.ts';

const useMetadataQuery = () => {
    const {
        data: categoryList = [],
        isLoading: categoryLoading,
        isError: categoryError,
    } = useQuery({
        queryKey: [QueryKeys.CATEGORY],
        queryFn: async () => {
            const { data, error } = await supabase.from('category').select().order('order_seq');
            if (error) {
                return [];
            } else {
                return (data as CategoryTranslationItem[]).map(
                    (item) =>
                        ({
                            value: item.id,
                            label: item.name,
                        }) as SelectOption,
                );
            }
        },
        staleTime: 1000 * 60 * 60,
    });

    const {
        data: relevanceList = [],
        isLoading: relevanceLoading,
        isError: relevanceError,
    } = useQuery({
        queryKey: [QueryKeys.RELEVANCE],
        queryFn: async () => {
            const { data, error } = await supabase.from('relevance').select().order('name');
            if (error) {
                return [];
            } else {
                return (data as RelevanceTranslationItem[]).map(
                    (item) =>
                        ({
                            value: item.id,
                            label: item.name,
                        }) as SelectOption,
                );
            }
        },
        staleTime: 1000 * 60 * 60,
    });

    return {
        categoryList,
        categoryLoading,
        categoryError,
        relevanceList,
        relevanceLoading,
        relevanceError,
    };
};
export default useMetadataQuery;
