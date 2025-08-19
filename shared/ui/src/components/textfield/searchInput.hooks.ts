import React, { useState, useRef, useCallback } from 'react';
import { useInput } from '@/hooks/useInput';

const useSearchField = (
    initialValue?: string,
    onChange?: (value: string) => void,
    onDone?: (value: string) => void,
) => {
    const [composing, setComposing] = useState(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { value, setValue, handleChange } = useInput<HTMLInputElement>({
        initialValue,
        onChange,
    });

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const handleCompositionStart = useCallback(() => setComposing(true), []);
    const handleCompositionEnd = useCallback(() => setComposing(false), []);

    const handleClear = useCallback(
        (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            e.stopPropagation();

            setValue('');
            inputRef.current?.focus();
        },
        [setValue],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter' && !composing) {
                e.stopPropagation();
                onDone?.(value);
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                inputRef.current?.blur();
            } else if (e.key === 'Tab') {
                inputRef.current?.blur();
            }
        },
        [onDone, value, composing],
    );

    const callbackRef = useCallback(
        (node: HTMLInputElement | null) => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', handleKeyDown);
                inputRef.current.removeEventListener('focus', handleFocus);
                inputRef.current.removeEventListener('blur', handleBlur);
                inputRef.current.removeEventListener('compositionstart', handleCompositionStart);
                inputRef.current.removeEventListener('compositionend', handleCompositionEnd);
            }

            if (node) {
                node.addEventListener('keydown', handleKeyDown);
                node.addEventListener('focus', handleFocus);
                node.addEventListener('blur', handleBlur);
                node.addEventListener('compositionstart', handleCompositionStart);
                node.addEventListener('compositionend', handleCompositionEnd);
            }

            inputRef.current = node;
        },
        [handleKeyDown, handleFocus, handleBlur, handleCompositionStart, handleCompositionEnd],
    );

    return {
        inputRef: callbackRef,
        isFocused,
        value,
        composing,
        setValue,
        handleChange,
        handleClear,
    };
};
export default useSearchField;
