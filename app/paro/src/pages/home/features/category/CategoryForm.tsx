import { useTranslation } from 'react-i18next';
import React from 'react';
import { Button, TextInput } from '@plitvice/ui';

type CategoryFormProps = {
    onAddCategory: (name: string) => void;
};

export function CategoryForm({ onAddCategory }: CategoryFormProps) {
    const { t } = useTranslation();

    const [value, setValue] = React.useState('');

    const handleClick = () => {
        if (value.trim()) {
            onAddCategory(value);
            setValue('');
        }
    };

    return (
        <div className="flex h-[36px] gap-2">
            <TextInput
                width={400}
                value={value}
                onChange={setValue}
                onDone={handleClick}
                placeholder={t('category.placeholder.input')}
            />
            <Button variant="normal" onClick={handleClick}>
                {t('button.add')}
            </Button>
        </div>
    );
}
