import { supabase } from '@/api/supabaseClient';
import { MetadataItem } from '@/api/model/metadata.ts';
import { snakeToCamel } from '@/utils/common';
import { ContentType } from '@/types/common.ts';

export async function fetchMetadata(contentType: ContentType): Promise<MetadataItem[]> {
    const { data, error } = await supabase.rpc('select_metadata', {
        p_content_type: contentType,
    });

    if (error) {
        return [];
    } else {
        return snakeToCamel(data) as MetadataItem[];
    }
}

export async function fetchMetadataSingle(contentId: string): Promise<MetadataItem | null> {
    const { data, error } = await supabase.from('metadata').select().eq('content_id', contentId).maybeSingle();

    if (error) {
        return data;
    } else {
        return snakeToCamel(data);
    }
}

export async function upsertMetadata(item: MetadataItem): Promise<boolean> {
    const { data, error } = await supabase.rpc('upsert_metadata', {
        p_content_id: item.contentId,
        p_content_type: item.contentType,
        p_category_id: item.categoryId,
        p_category_weight: item.categoryWeight,
        p_updated_date: item.updatedDate,
        p_relevance: item.relevance,
        p_tag: item.tag,
    });

    if (error) {
        return false;
    } else {
        return data;
    }
}
