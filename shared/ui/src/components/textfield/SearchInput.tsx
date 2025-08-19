import { BoxComponentStyles, Size } from '@/types/common.ts';
import React, { useCallback } from 'react';
import useSearchField from '@/components/textfield/searchInput.hooks.ts';
import IconSearch from '@/assets/icSearch.svg?react';
import IconTextClear from '@/assets/icTextClear.svg?react';
import InputBox from './InputBox.tsx';

export interface SearchFieldProps {
    size?: Size;
    width?: number;
    placeholder?: string;
    value?: string;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
    className?: string;
}

const SearchInput = ({
    size = 'small',
    width = 0,
    placeholder = 'Search',
    value: initialValue = '',
    onChange = () => {},
    onDone = () => {},
    className = '',
}: SearchFieldProps) => {
    const { inputRef, isFocused, value, handleClear, handleChange } = useSearchField(initialValue, onChange, onDone);

    let sizeClass = '';
    switch (size) {
        case 'small':
            sizeClass += ' py-[6px]';
            break;
        case 'medium':
            sizeClass += ' py-[7px]';
            break;
        case 'large':
            sizeClass += ' py-[14px]';
            break;
    }
    const focusClass = isFocused ? 'border-blue-500' : 'border-grey-40';
    const { height, textSizeClass, iconSizeClass } = BoxComponentStyles[size];

    const handleClearMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    }, []);

    return (
        <InputBox.Root
            className={`${sizeClass} items-center justify-start gap-[6px] bg-white pl-[9px] pr-[7px] hover:border-blue-500 ${focusClass} ${className}`}
            width={width}
            height={height}
        >
            <InputBox.Prefix>
                <div className={`${iconSizeClass} text-grey-50`}>
                    <IconSearch className="h-full w-full object-contain" />
                </div>
            </InputBox.Prefix>
            <InputBox.Field
                className={`${textSizeClass} focus:outline-none focus:ring-0`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                ref={inputRef}
            />
            <InputBox.Suffix className={`${iconSizeClass} ${!(isFocused && value) && 'hidden'}`}>
                <button onMouseDown={handleClearMouseDown} onClick={handleClear}>
                    <IconTextClear />
                </button>
            </InputBox.Suffix>
        </InputBox.Root>
    );
};
export { SearchInput };
