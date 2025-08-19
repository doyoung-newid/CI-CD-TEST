import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList.tsx';

interface SelectBoxHookProps {
    onChange?: (value: string | number) => void;
}

const useSelectBox = ({ onChange }: SelectBoxHookProps) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = useCallback(() => {
        setIsFocused((prev) => !prev);
    }, []);

    const handleSelected = useCallback(
        (option: SelectOption) => {
            setIsFocused(false);
            onChange?.(option.value);
        },
        [onChange],
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);
            }
        };

        if (isFocused) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isFocused]);

    return {
        isFocused,
        containerRef,
        toggleDropdown,
        handleSelected,
    };
};
export default useSelectBox;
