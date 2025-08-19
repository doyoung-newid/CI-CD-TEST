import React, { useCallback, useEffect, useRef, useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList.tsx';

interface ModSelectBoxHookProps {
    initialValue?: SelectOption;
    onChange?: (selected: SelectOption, isModified: boolean) => void;
    onEnter?: (selected: SelectOption, isModified: boolean) => void;
    onEscape?: () => void;
}

const useModSelectBox = ({ initialValue, onChange, onEnter, onEscape }: ModSelectBoxHookProps) => {
    const [originItem, setOriginItem] = useState(initialValue);
    const [isModified, setIsModified] = useState(false);
    const [selectedItem, setSelectedItem] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSelectedItem(initialValue);
        setOriginItem(initialValue);
        setIsModified(false);
    }, [initialValue]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isFocused) return;

            if (e.key === 'Escape') {
                setIsFocused(false);
                if (onEscape) onEscape();
            } else if (e.key === 'Enter') {
                setIsFocused(false);
                if (selectedItem && onEnter) {
                    onEnter(selectedItem, isModified);
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isFocused, selectedItem, isModified, onEnter, onEscape]);

    const toggleDropdown = useCallback(() => {
        setIsFocused((prev) => !prev);
    }, []);

    const handleSelected = useCallback(
        (option: SelectOption) => {
            const newIsModified = originItem?.value !== option.value;

            setSelectedItem(option);
            setIsModified(newIsModified);
            setIsFocused(false);

            if (onChange) {
                onChange(option, newIsModified);
            }
        },
        [originItem, onChange],
    );

    const resetToOrigin = useCallback(
        (e?: React.MouseEvent) => {
            if (e) {
                e.stopPropagation();
            }

            setSelectedItem(originItem);
            setIsModified(false);

            if (onChange && originItem) {
                onChange(originItem, false);
            }
        },
        [originItem, onChange],
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
        containerRef,
        isFocused,
        selectedItem,
        isModified,
        toggleDropdown,
        handleSelected,
        resetToOrigin,
    };
};
export default useModSelectBox;
