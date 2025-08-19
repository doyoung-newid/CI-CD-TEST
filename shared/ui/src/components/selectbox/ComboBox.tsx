import { BoxComponentStyles, LabelPosition, Size } from '@/types/common';
import { SelectBoxProps } from '@/components/selectbox/SelectBox';
import useComboBox from '@/components/selectbox/comboBox.hooks';
import { DropdownList, SelectOption } from '@/components/selectbox/DropdownList';
import DropdownIcon from '@/assets/icDropdownArrow.svg?react';
import { LabeledInput } from '@/components/textfield/LabeledInput';

type ComboBoxSize = Extract<Size, 'medium' | 'large'>;

export interface ComboBoxProps extends Omit<SelectBoxProps, 'size'> {
    size: ComboBoxSize;
    noResultMessage?: string;
    labelPosition?: LabelPosition;
    optionList: SelectOption[];
    onInputChange?: (value: string) => void;
    showAllOptionsOnFocus?: boolean;
    allowCustomValue?: boolean;
    readOnly?: boolean;
}

const ComboBox = ({
    size = 'medium',
    width = 0,
    placeholder = 'Placeholder',
    noResultMessage = 'No results found',
    label = '',
    labelColor = '',
    labelPosition = 'outer',
    value = undefined,
    optionList,
    onChange = () => {},
    onInputChange = () => {},
    showAllOptionsOnFocus = true,
    allowCustomValue = true,
    readOnly = false,
    disabled = false,
}: ComboBoxProps) => {
    const {
        isFocused,
        inputValue,
        filteredList,
        containerRef,
        inputRef,
        handleInputChange,
        handleInputFocus,
        toggleDropdown,
        handleSelected,
        handleKeyDown,
    } = useComboBox(value, optionList, onChange, onInputChange, showAllOptionsOnFocus, allowCustomValue);

    const fieldColor = disabled ? 'bg-grey-20' : 'bg-white hover:bg-blue-100 hover:border-blue-500 group';
    const fieldBorderColor = isFocused ? 'border-blue-500' : 'border-grey-40';
    const inputBgColor = disabled ? 'bg-transparent' : 'bg-white';
    const buttonBorderColor = isFocused ? 'border-blue-500' : 'border-grey-40';
    const iconRotation = isFocused ? 'rotate-180' : 'rotate-0';

    const { heightClass, iconSizeClass } = BoxComponentStyles[size];

    return (
        <LabeledInput.Root className={'p-0'} width={width} size={size} ref={containerRef}>
            {labelPosition === 'outer' ? (
                <LabeledInput.OuterLabel color={labelColor}>{label}</LabeledInput.OuterLabel>
            ) : null}
            <div
                className={`flex w-full ${heightClass} ${fieldColor} ${fieldBorderColor} items-center overflow-hidden rounded-[4px] border-[1px] p-0`}
            >
                <LabeledInput.Content className={`flex-1 justify-center px-[11px] ${inputBgColor}`}>
                    {labelPosition === 'inner' ? (
                        <LabeledInput.InnerLabel color={labelColor}>{label}</LabeledInput.InnerLabel>
                    ) : null}
                    <LabeledInput.Input
                        className={'placeholder:text-grey-40'}
                        ref={inputRef}
                        value={inputValue}
                        placeholder={placeholder}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onKeyDown={handleKeyDown}
                        readOnly={readOnly}
                        disabled={disabled}
                    />
                </LabeledInput.Content>
                <button
                    onClick={toggleDropdown}
                    className={`flex h-full items-center justify-center rounded-r-[4px] border-l bg-transparent px-[7px] ${buttonBorderColor} group-hover:border-blue-500`}
                    disabled={disabled}
                >
                    <DropdownIcon
                        className={`${iconSizeClass} ${iconRotation} text-grey-50 transition-all duration-100`}
                    />
                </button>
            </div>
            <DropdownList
                size={size}
                noResultMessage={noResultMessage}
                isFocused={isFocused}
                optionList={filteredList}
                onSelected={handleSelected}
            />
        </LabeledInput.Root>
    );
};

export { ComboBox };
