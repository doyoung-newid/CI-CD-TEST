import { useCallback, useEffect, useRef, useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList';

interface SelectBoxHookProps {
    onChange?: (value: string | number) => void;
}
type DropdownDirection = 'up' | 'down';

const useSelectBox = ({ onChange }: SelectBoxHookProps) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [direction, setDirection] = useState<DropdownDirection>('down');
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = useCallback(() => {
        if (!containerRef.current) return;

        if (!isFocused) {
            const DROPDOWN_HEIGHT_THRESHOLD = 200;
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setDirection(spaceBelow < DROPDOWN_HEIGHT_THRESHOLD ? 'up' : 'down');
        }

        setIsFocused((prev) => !prev);
    }, [isFocused]);

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
        direction,
        containerRef,
        toggleDropdown,
        handleSelected,
    };
};
export default useSelectBox;
