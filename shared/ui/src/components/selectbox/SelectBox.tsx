import { BoxComponentStyles, Size } from '@/types/common';
import useSelectBox from '@/components/selectbox/selectBox.hooks';
import { SelectOption, DropdownList } from '@/components/selectbox/DropdownList';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';
import { LabeledInput } from '../textfield/LabeledInput';

type SelectBoxSize = Extract<Size, 'small' | 'medium'>;

export interface SelectBoxProps {
    size?: SelectBoxSize;
    width?: number;
    border?: boolean;
    bgColor?: string;
    placeholder?: string;
    label?: string;
    labelColor?: string;
    supportingText?: string;
    supportingTextColor?: string;
    optionList: SelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    disabled?: boolean;
    className?: string;
}

const SelectBox = ({
    size = 'small',
    width = 0,
    border = true,
    bgColor = '#00000000',
    placeholder = 'Placeholder',
    label = '',
    labelColor = '',
    supportingText = '',
    supportingTextColor = '',
    value = undefined,
    optionList,
    onChange = undefined,
    disabled = false,
    className = '',
}: SelectBoxProps) => {
    const { isFocused, direction, containerRef, toggleDropdown, handleSelected } = useSelectBox({ onChange });
    const { heightClass, iconSizeClass } = BoxComponentStyles[size];

    const fieldColor = disabled ? 'bg-grey-20' : 'hover:bg-blue-100 hover:border-blue-500';
    const fieldBorderColor = isFocused ? 'border-blue-500' : border ? 'border-grey-40' : 'border-transparent';
    const hoverBgColor = disabled ? '' : 'hover:bg-blue-100';
    const rotation = isFocused ? 'rotate-180' : 'rotate-0';
    const cursor = disabled ? '' : 'cursor-pointer';

    return (
        <LabeledInput.Root className={`p-0 ${className}`} width={width} size={size} ref={containerRef}>
            {label ? <LabeledInput.OuterLabel color={labelColor}>{label}</LabeledInput.OuterLabel> : null}
            <div
                className={`flex w-full ${heightClass} flex items-center gap-[4px] pl-[11px] pr-[7px] ${fieldColor} ${fieldBorderColor} rounded-[4px] border ${hoverBgColor} ${cursor}`}
                onClick={disabled ? undefined : toggleDropdown}
                style={{ backgroundColor: bgColor }}
            >
                <LabeledInput.Input
                    value={optionList.find((option) => option.value === value)?.label || ''}
                    placeholder={placeholder}
                    readOnly={true}
                    disabled={disabled}
                    className={`cursor-pointer`}
                />
                <div className={`${iconSizeClass}`}>
                    <DropdownIcon
                        className={`${iconSizeClass} ${rotation} text-grey-50 transition-transform duration-100`}
                    />
                </div>
            </div>
            {supportingText !== '' ? (
                <LabeledInput.SupportingText color={supportingTextColor}>{supportingText}</LabeledInput.SupportingText>
            ) : null}
            <DropdownList
                size={size}
                isFocused={isFocused}
                optionList={optionList}
                onSelected={handleSelected}
                direction={direction}
            />
        </LabeledInput.Root>
    );
};
export { SelectBox };
