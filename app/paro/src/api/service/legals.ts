import { supabase } from '@/api/supabaseClient';
import { LegalItem } from '@/api/model/legal';
import { snakeToCamel } from '@/utils/common';

export async function fetchLegals(country: string): Promise<Array<LegalItem>> {
    const { data, error } = await supabase.from('legal').select().eq('country', country);

    if (error) {
        return [];
    } else {
        return snakeToCamel(data) as Array<LegalItem>;
    }
}

export async function upsertLegal(item: LegalItem): Promise<boolean> {
    const { data, error } = await supabase.rpc('upsert_legal', {
        p_type: item.type,
        p_content: item.content,
        p_lang: item.lang,
        p_country: item.country,
    });

    if (error) {
        return false;
    } else {
        return data;
    }
}
