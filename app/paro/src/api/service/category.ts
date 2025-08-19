import { supabase } from '@/api/supabaseClient.ts';
import { snakeToCamel } from '@/utils/common.ts';
import { CategoryItem, CategoryTranslationItem } from '@/api/model/category.ts';

export async function fetchCategory(): Promise<CategoryItem[]> {
    const { data, error } = await supabase.rpc('select_category');

    if (error) {
        return [];
    } else {
        const result = Array.isArray(data) ? data : [];
        return snakeToCamel(result) as Array<CategoryItem>;
    }
}

export async function upsertCategory({
    id = undefined,
    name,
    lang = undefined,
}: {
    id?: number;
    name: string;
    lang?: string;
}): Promise<(CategoryTranslationItem & { orderSeq: number }) | null> {
    const { data, error } = await supabase.rpc('upsert_category', {
        p_id: id,
        p_lang: lang,
        p_name: name,
    });

    if (error) {
        console.error(error);
        return null;
    } else {
        return data as CategoryTranslationItem & { orderSeq: number };
    }
}

export async function deleteCategory(id: number): Promise<boolean> {
    const { error } = await supabase.rpc('delete_category', {
        p_id: id,
    });

    if (error) {
        console.error(error);
        return false;
    } else {
        return true;
    }
}

export async function updateCategoryOrder({ id, order }: { id: number; order: number }): Promise<boolean> {
    const { error } = await supabase.rpc('update_category_order', {
        p_id: id,
        new_order_seq: order,
    });

    if (error) {
        console.error(error);
        return false;
    } else {
        return true;
    }
}
