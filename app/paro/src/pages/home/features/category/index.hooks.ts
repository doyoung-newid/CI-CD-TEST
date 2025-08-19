import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    deleteCategory,
    fetchCategory,
    updateCategoryOrder as updateOrder,
    upsertCategory,
} from '@/api/service/category.ts';
import { CategoryItem, CategoryTranslationItem } from '@/api/model/category.ts';

function useCategory() {
    const [categoryList, setCategoryList] = useState<CategoryItem[]>([]);

    const updatedItemsRef = useRef<Map<number, CategoryItem>>(new Map());

    const getUpdatedList = useCallback(() => {
        return categoryList.map((item) => {
            const updatedItem = updatedItemsRef.current.get(item.id);
            return updatedItem || item;
        });
    }, [categoryList]);

    const displayCategoryList = useMemo(() => getUpdatedList(), [getUpdatedList]);

    useEffect(() => {
        fetchCategory().then((result) => {
            setCategoryList(sortByOrder(result));
            updatedItemsRef.current.clear();
        });
    }, []);

    const toCategoryItem = useCallback((item: CategoryTranslationItem & { orderSeq: number }): CategoryItem => {
        const { lang, name, ...rest } = item;
        return {
            name: { [lang]: name },
            link: [],
            ...rest,
        };
    }, []);

    const addCategory = useCallback(
        async (name: string) => {
            const result = await upsertCategory({ name });

            if (result?.id) {
                const categoryItem = toCategoryItem(result);
                const updatedList = getUpdatedList();
                const newList = sortByOrder([...updatedList, categoryItem]);
                setCategoryList(newList);

                updatedItemsRef.current.clear();
            }
        },
        [categoryList, toCategoryItem, getUpdatedList],
    );

    const removeCategory = useCallback(
        async (id: number) => {
            const success = await deleteCategory(id);
            if (success) {
                const updatedList = getUpdatedList();
                const newList = updatedList.filter((item) => item.id !== id);
                setCategoryList(newList);

                updatedItemsRef.current.clear();

                return true;
            } else {
                return false;
            }
        },
        [categoryList, getUpdatedList],
    );

    const reorderCategory = useCallback(
        async ({ id, order, reorderedList }: { id: number; order: number; reorderedList: CategoryItem[] }) => {
            setCategoryList(reorderedList);

            await updateOrder({ id, order });

            updatedItemsRef.current.clear();
        },
        [],
    );

    const existsCategory = useCallback(
        (item: CategoryTranslationItem) => {
            return displayCategoryList.some((category) => {
                return category.id !== item.id && category.name.en === item.name;
            });
        },
        [displayCategoryList],
    );

    const updateCategory = useCallback(
        async (prop: CategoryTranslationItem) => {
            try {
                if (await upsertCategory(prop)) {
                    const currentItem = categoryList.find((item) => item.id === prop.id);
                    if (currentItem) {
                        const updatedItem = {
                            ...currentItem,
                            name: {
                                ...currentItem.name,
                                [prop.lang]: prop.name,
                            },
                        };

                        updatedItemsRef.current.set(prop.id, updatedItem);
                    }

                    return true;
                }
                return false;
            } catch {
                return false;
            }
        },
        [categoryList],
    );

    return {
        categoryList: displayCategoryList,
        addCategory,
        removeCategory,
        reorderCategory,
        updateCategory,
        existsCategory,
    };
}

export default useCategory;

const sortByOrder = (items: CategoryItem[]) => {
    return [...items].sort((lhs, rhs) => lhs.orderSeq - rhs.orderSeq);
};
