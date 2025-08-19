import { supabase } from '@/api/supabaseClient';
import { snakeToCamel } from '@/utils/common';
import { RelevanceItem, RelevanceLocalized, RelevanceTranslationItem } from '@/api/model/relevance.ts';

export async function fetchRelevance(): Promise<RelevanceItem[]> {
    const { data, error } = await supabase.rpc('select_relevance');

    if (error) {
        return [];
    } else {
        return snakeToCamel(data) as RelevanceItem[];
    }
}

export async function insertRelevance(relevanceList: RelevanceLocalized): Promise<RelevanceItem | null> {
    const { data, error } = await supabase.rpc('insert_relevance', { p_data: relevanceList });

    if (error) {
        return null;
    } else {
        return data;
    }
}

export async function upsertRelevance(
    name: string,
    id?: number,
    lang?: string,
): Promise<RelevanceTranslationItem | null> {
    const { data, error } = await supabase.rpc('upsert_relevance', {
        p_name: name,
        p_id: id,
        p_lang: lang,
    });

    if (error) {
        return null;
    } else {
        return data;
    }
}

export async function deleteRelevance(id: number): Promise<boolean> {
    const { data, error } = await supabase.rpc('delete_relevance', { p_id: id });

    if (error) {
        return false;
    } else {
        return data;
    }
}
