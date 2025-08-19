import { useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList';

interface Props {
    tabList: SelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
}

function TabMenu({ tabList, value, onChange }: Props) {
    const [selected, setSelected] = useState(value);
    const activeStyles = `text-blue-600 border-blue-600 hover:bg-grey-10`;
    const inactiveStyles = `text-grey-90 border-transparent hover:bg-grey-10`;

    return (
        <ul className={`flex flex-row`}>
            {tabList.map((option) => (
                <li
                    key={`tabs-${option.value}`}
                    className={`block cursor-pointer border-b-[2px] px-[32px] py-[15px] ${option.value === selected ? activeStyles : inactiveStyles}`}
                    onClick={() => {
                        setSelected(option.value);
                        onChange?.(option.value);
                    }}
                >
                    <p className={`text-b16`}>{option.label}</p>
                </li>
            ))}
        </ul>
    );
}
export { TabMenu };
