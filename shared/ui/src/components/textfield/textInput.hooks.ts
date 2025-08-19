import { useState, useRef, useCallback } from 'react';
import { useInput } from '@/hooks/useInput.ts';

const useTextField = (initialValue?: string, onChange?: (value: string) => void, onDone?: (value: string) => void) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const { value, setValue, handleChange } = useInput<HTMLInputElement>({
        initialValue,
        onChange,
    });

    const handleFocus = useCallback(() => setIsFocused(true), []);
    const handleBlur = useCallback(() => setIsFocused(false), []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.stopPropagation();
                onDone?.(value);
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                inputRef.current?.blur();
            } else if (e.key === 'Tab') {
                inputRef.current?.blur();
            }
        },
        [onDone, value],
    );

    const callbackRef = useCallback(
        (node: HTMLInputElement | null) => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('keydown', handleKeyDown);
                inputRef.current.removeEventListener('focus', handleFocus);
                inputRef.current.removeEventListener('blur', handleBlur);
            }

            if (node) {
                node.addEventListener('keydown', handleKeyDown);
                node.addEventListener('focus', handleFocus);
                node.addEventListener('blur', handleBlur);
            }

            inputRef.current = node;
        },
        [handleKeyDown, handleFocus, handleBlur],
    );

    return {
        inputRef: callbackRef,
        isFocused,
        value,
        setValue,
        handleChange,
    };
};
export default useTextField;
