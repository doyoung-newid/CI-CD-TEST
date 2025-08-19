import React, { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SelectOption } from '@/components/selectbox/DropdownList';

const useComboBox = (
    value: string | number | undefined,
    list: SelectOption[],
    onChange?: (value: string | number) => void,
    onInputChange?: (value: string) => void,
    showAllOptionsOnFocus: boolean = true,
    allowCustomValue: boolean = true,
) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState('');
    const [filteredList, setFilteredList] = useState<SelectOption[]>([]);
    const [selectedItem, setSelectedItem] = useState<SelectOption | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (list.length > 0 && value !== undefined) {
            const selectedOption = list.find((option) => option.value === value);
            if (selectedOption) {
                setInputValue(selectedOption.label);
                setSelectedItem(selectedOption);
            } else if (allowCustomValue && typeof value === 'string') {
                setInputValue(value);
                setSelectedItem({ value, label: value });
            } else {
                setInputValue('');
                setSelectedItem(null);
            }
        } else {
            setInputValue('');
            setSelectedItem(null);
        }
    }, [value, list, allowCustomValue]);

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = event.target.value;
            setInputValue(newValue);
            onInputChange?.(newValue);

            if (newValue.trim() === '') {
                setFilteredList(list);
            } else {
                const filtered = list.filter((option) => option.label.toLowerCase().includes(newValue.toLowerCase()));
                setFilteredList(filtered);
            }
        },
        [list, onInputChange],
    );

    const resetToLastSelectedOption = useCallback(() => {
        if (selectedItem) {
            setInputValue(selectedItem.label);
            onInputChange?.(selectedItem.label);
        } else {
            setInputValue('');
            onInputChange?.('');
        }
    }, [selectedItem, onInputChange]);

    const handleInputFocus = useCallback(() => {
        setIsFocused(true);
        if (showAllOptionsOnFocus) {
            setFilteredList(list);
        }
    }, [showAllOptionsOnFocus, list]);

    const toggleDropdown = useCallback(() => {
        const length = inputRef.current?.value.length;
        if (length) {
            inputRef.current?.setSelectionRange(length, length);
        }

        if (isFocused) {
            inputRef.current?.blur();
            setIsFocused(false);

            if (!allowCustomValue) {
                resetToLastSelectedOption();
            }
        } else {
            if (inputRef.current) {
                inputRef.current.focus();
            }
            setIsFocused(true);
            setFilteredList(list);
        }
    }, [list, allowCustomValue, isFocused, resetToLastSelectedOption]);

    const handleSelected = useCallback(
        (option: SelectOption) => {
            setInputValue(option.label);
            setSelectedItem(option);
            setIsFocused(false);
            onChange?.(option.value);
            onInputChange?.(option.label);
            inputRef.current?.blur();
        },
        [onChange, onInputChange],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                e.preventDefault();

                const matchingOption = list.find((option) => option.label.toLowerCase() === inputValue.toLowerCase());

                if (!inputValue) {
                    setIsFocused(false);
                    e.currentTarget.blur();
                } else if (matchingOption) {
                    setIsFocused(false);
                    e.currentTarget.blur();

                    onChange?.(matchingOption.value);
                    setSelectedItem(matchingOption);
                } else if (allowCustomValue) {
                    setIsFocused(false);
                    e.currentTarget.blur();

                    const customValue = inputValue;
                    onChange?.(customValue);
                    setSelectedItem({ value: customValue, label: customValue });
                }
            } else if (e.key === 'Escape') {
                setIsFocused(false);
                e.currentTarget.blur();

                if (!allowCustomValue && inputValue) {
                    resetToLastSelectedOption();
                }
            } else if (e.key === 'Tab') {
                setIsFocused(false);

                if (!allowCustomValue && inputValue) {
                    resetToLastSelectedOption();
                }
            }
        },
        [allowCustomValue, resetToLastSelectedOption, list, onChange, inputValue],
    );

    useEffect(() => {
        if (list.length > 0) {
            if (isFocused && (inputValue.trim() === '' || showAllOptionsOnFocus)) {
                setFilteredList(list);
            } else {
                const filtered = list.filter((option) => option.label.toLowerCase().includes(inputValue.toLowerCase()));
                setFilteredList(filtered);
            }
        }
    }, [list, isFocused, showAllOptionsOnFocus, inputValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsFocused(false);

                if (!allowCustomValue && inputValue) {
                    resetToLastSelectedOption();
                }
            }
        };

        if (isFocused) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [allowCustomValue, isFocused, resetToLastSelectedOption, inputValue]);

    return {
        isFocused,
        inputValue,
        selectedItem,
        filteredList,
        containerRef,
        inputRef,
        handleInputChange,
        handleInputFocus,
        toggleDropdown,
        handleSelected,
        handleKeyDown,
    };
};
export default useComboBox;
