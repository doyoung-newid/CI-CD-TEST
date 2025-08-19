import { BoxComponentStyles, Size } from '@/types/common.ts';
import useSelectBox from '@/components/selectbox/selectBox.hooks.ts';
import DropdownList, { SelectOption } from '@/components/selectbox/DropdownList.tsx';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';
import { LabeledInput } from '../textfield/LabeledInput';

type SelectBoxSize = Extract<Size, 'small' | 'medium'>;

export interface SelectBoxProps {
    size?: SelectBoxSize;
    width?: number;
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
    const { isFocused, containerRef, toggleDropdown, handleSelected } = useSelectBox({ onChange });
    const { heightClass, iconSizeClass } = BoxComponentStyles[size];

    const fieldColor = disabled ? 'bg-grey-20' : 'bg-white hover:bg-blue-100 hover:border-blue-500';
    const fieldBorderColor = isFocused ? 'border-blue-500' : 'border-grey-40';
    const hoverBgColor = disabled ? '' : 'hover:bg-blue-100';
    const rotation = isFocused ? 'rotate-180' : 'rotate-0';
    const cursor = disabled ? '' : 'cursor-pointer';

    return (
        <LabeledInput.Root className={`p-0 ${className}`} width={width} size={size} ref={containerRef}>
            <LabeledInput.OuterLabel color={labelColor}>{label}</LabeledInput.OuterLabel>
            <div
                className={`flex w-full ${heightClass} flex items-center gap-[4px] pl-[11px] pr-[7px] ${fieldColor} ${fieldBorderColor} rounded-[4px] border-[1px] ${hoverBgColor} ${cursor}`}
                onClick={disabled ? undefined : toggleDropdown}
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
            <DropdownList size={size} isFocused={isFocused} optionList={optionList} onSelected={handleSelected} />
        </LabeledInput.Root>
    );
};
export { SelectBox };
