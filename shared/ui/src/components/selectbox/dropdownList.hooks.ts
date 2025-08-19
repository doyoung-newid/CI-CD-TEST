import { useEffect, useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList.tsx';

const useDropdownList = (
    isVisible: boolean,
    filteredValue: string,
    showAllOptionsOnFocus = true,
    optionList: SelectOption[],
) => {
    const [filteredList, setFilteredList] = useState<SelectOption[]>(optionList);

    useEffect(() => {
        if (isVisible) {
            if (filteredValue.trim() === '') {
                setFilteredList(optionList);
            } else {
                const filtered = optionList.filter((option) =>
                    option.label.toLowerCase().includes(filteredValue.toLowerCase()),
                );
                setFilteredList(filtered);
            }
        } else {
            if (showAllOptionsOnFocus) {
                setFilteredList(optionList);
            }
        }
    }, [isVisible, filteredValue, optionList]);

    return {
        filteredList,
    };
};
export default useDropdownList;
