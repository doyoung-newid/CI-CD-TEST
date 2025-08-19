import { useTranslation } from 'react-i18next';
import CategoryTable from '@/pages/home/features/category/CategoryTable.tsx';
import useCategory from '@/pages/home/features/category/index.hooks.ts';
import { CategoryForm } from '@/pages/home/features/category/CategoryForm.tsx';
import CategoryLinkSheet from '@/pages/home/features/category/CategoryLinkSheet.tsx';
import { useState } from 'react';
import { CategoryItem } from '@/api/model/category.ts';

function CategoryPage() {
    const { t } = useTranslation();

    const { categoryList, removeCategory, addCategory, updateCategory, reorderCategory, existsCategory } =
        useCategory();

    const [isSheetOpen, setSheetOpen] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | undefined>(undefined);

    return (
        <div className={'flex h-screen flex-col gap-[21px] px-[36px] pb-[36px] pt-[48px]'}>
            <h1>{t('category.title')}</h1>
            <CategoryForm onAddCategory={addCategory} />
            <CategoryTable
                categoryList={categoryList}
                onRemoveCategory={removeCategory}
                onUpdateCategory={updateCategory}
                onReorderCategory={reorderCategory}
                onExistsCategory={existsCategory}
                onShowDetail={(category: CategoryItem) => {
                    setSelectedCategory(category);
                    setSheetOpen(true);
                }}
            />
            <CategoryLinkSheet
                category={selectedCategory}
                isOpen={isSheetOpen}
                onClose={() => setSheetOpen(false)}
                onCategoryReset={() => setSelectedCategory(undefined)}
            />
        </div>
    );
}

export default CategoryPage;
