import useDropdownList from '@/components/selectbox/dropdownList.hooks';
import { Size } from '@/types/common';

const SizeStyles = {
    small: {
        text: 'text-r14',
        py: 'py-[7px]',
    },
    medium: {
        text: 'text-r16',
        py: 'py-[9px]',
    },
    large: {
        text: 'text-r18',
        py: 'py-[15px]',
    },
};

export interface DropdownListProps {
    size?: Size;
    noResultMessage?: string;
    isFocused: boolean;
    inputValue?: string;
    showAllOptionsOnFocus?: boolean;
    optionList: SelectOption[];
    onSelected?: (option: SelectOption) => void;
    direction?: 'up' | 'down';
}

export interface SelectOption {
    value: string | number;
    label: string;
    disabled?: boolean;
}

const DropdownList = ({
    size = 'small',
    noResultMessage = '',
    isFocused = false,
    inputValue = '',
    showAllOptionsOnFocus = true,
    optionList,
    onSelected,
    direction = 'down',
}: DropdownListProps) => {
    const { filteredList } = useDropdownList(isFocused, inputValue, showAllOptionsOnFocus, optionList);

    const display = isFocused ? 'block' : 'hidden';
    const textStyle = SizeStyles[size].text;
    const positionClasses = direction === 'down' ? 'top-[calc(100%+4px)]' : 'bottom-[calc(100%+4px)]';

    return (
        <ul
            className={`border-grey-20 absolute left-0 right-0 ${positionClasses} max-h-[200px] overflow-y-auto rounded-[4px] border bg-white px-0 py-[6px] shadow-[0_4px_8px_0_rgba(28,28,28,0.30)] ${display} non-draggable z-[10000]`}
            role="listbox"
            aria-multiselectable="false"
        >
            {filteredList.length > 0 ? (
                filteredList.map((option) => (
                    <li
                        key={option.value}
                        onClick={() => onSelected?.(option)}
                        role="option"
                        className={`w-full px-[12px] ${SizeStyles[size].py} ${textStyle} cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-100 hover:bg-gray-100`}
                    >
                        {option.label}
                    </li>
                ))
            ) : (
                <li className={`px-[12px] ${SizeStyles[size].py} ${textStyle} italic text-gray-400`}>
                    {noResultMessage}
                </li>
            )}
        </ul>
    );
};
export { DropdownList };
