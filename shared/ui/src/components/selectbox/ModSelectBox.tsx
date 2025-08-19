import React, { useCallback } from 'react';
import { BoxComponentStyles, Size } from '@/types/common.ts';
import useModSelectBox from '@/components/selectbox/ModSelectBox.hooks.ts';
import DropdownList, { SelectOption } from '@/components/selectbox/DropdownList.tsx';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';
import IconReset from '@/assets/icReset.svg?react';

export interface ModSelectBoxProps {
    size?: Size;
    width?: number;
    placeholder?: string;
    value?: SelectOption;
    optionList: SelectOption[];
    onChange?: (selected: SelectOption, isModified: boolean) => void;
    onEnter?: (selected: SelectOption, isModified: boolean) => void;
    onEscape?: () => void;
    disabled?: boolean;
    className?: string;
}

const ModSelectBox = ({
    size = 'small',
    width = 0,
    placeholder = 'Placeholder',
    value = undefined,
    optionList,
    onChange = () => {},
    onEnter = () => {},
    onEscape = () => {},
    disabled = false,
    className = '',
}: ModSelectBoxProps) => {
    const { containerRef, isFocused, selectedItem, isModified, toggleDropdown, handleSelected, resetToOrigin } =
        useModSelectBox({
            initialValue: value,
            onChange,
            onEnter,
            onEscape,
        });

    const { textSizeClass, heightClass, iconSizeClass } = BoxComponentStyles[size];
    const containerWidth = { width: width > 0 ? `${width}px` : '100%' };

    let stateClass = isFocused
        ? 'border-blue-500 bg-white'
        : isModified
          ? 'border-transparent bg-blue-150 hover:border-grey-40'
          : 'border-transparent hover:border-grey-40';

    let inputTextClass = isModified && !isFocused ? 'text-blue-600 font-[700]' : `text-grey-90 ${textSizeClass}`;

    if (disabled) {
        stateClass = 'border-transparent bg-grey-20';
        inputTextClass = 'text-grey-50';
    }

    const rotation = isFocused ? 'rotate-180' : 'rotate-0';
    const cursor = disabled ? '' : 'cursor-pointer';

    const handleClearMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
    }, []);

    return (
        <div
            className={`relative flex h-fit flex-col items-start gap-[4px] p-0 ${className}`}
            style={containerWidth}
            ref={containerRef}
        >
            <div
                className={`flex w-full ${heightClass} items-center gap-[4px] rounded-[4px] border-[1px] pl-[11px] pr-[7px] ${stateClass} ${cursor}`}
                onClick={disabled ? undefined : toggleDropdown}
            >
                <input
                    value={selectedItem?.label || ''}
                    placeholder={placeholder}
                    readOnly={true}
                    disabled={disabled}
                    className={`h-full w-full cursor-pointer ${inputTextClass}`}
                />
                {isModified && !isFocused && !disabled ? (
                    <button
                        className="size-[20px]"
                        onMouseDown={handleClearMouseDown}
                        onClick={(e) => {
                            e.stopPropagation();
                            resetToOrigin();
                        }}
                    >
                        <IconReset />
                    </button>
                ) : (
                    <div className={`${iconSizeClass}`}>
                        <DropdownIcon
                            className={`${iconSizeClass} ${rotation} text-grey-50 transition-transform duration-100`}
                        />
                    </div>
                )}
            </div>
            <DropdownList size={size} isFocused={isFocused} optionList={optionList} onSelected={handleSelected} />
        </div>
    );
};
export { ModSelectBox };
