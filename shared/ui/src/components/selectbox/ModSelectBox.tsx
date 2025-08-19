import { BoxComponentStyles, Size } from '@/types/common';
import useModSelectBox from '@/components/selectbox/ModSelectBox.hooks';
import { DropdownList, SelectOption } from '@/components/selectbox/DropdownList';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';

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
    const { containerRef, isFocused, selectedItem, toggleDropdown, handleSelected } = useModSelectBox({
        initialValue: value,
        onChange,
        onEnter,
        onEscape,
    });

    const { textSizeClass, heightClass, iconSizeClass } = BoxComponentStyles[size];
    const containerWidth = { width: width > 0 ? `${width}px` : '100%' };

    let stateClass = isFocused ? 'border-blue-500 bg-white' : 'border-transparent hover:border-grey-40';

    let inputTextClass = `text-grey-90 ${textSizeClass}`;

    if (disabled) {
        stateClass = 'border-transparent bg-grey-20';
        inputTextClass = 'text-grey-50';
    }

    const rotation = isFocused ? 'rotate-180' : 'rotate-0';
    const cursor = disabled ? '' : 'cursor-pointer';

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
                <div className={`${iconSizeClass}`}>
                    <DropdownIcon
                        className={`${iconSizeClass} ${rotation} text-grey-50 transition-transform duration-100`}
                    />
                </div>
            </div>
            <DropdownList size={size} isFocused={isFocused} optionList={optionList} onSelected={handleSelected} />
        </div>
    );
};
export { ModSelectBox };
