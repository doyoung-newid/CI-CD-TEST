import { useState, useRef, useCallback, useEffect } from 'react';
import { useInput } from '@/hooks/useInput';

interface UseModifiedInputParams {
    initialValue?: string;
    onChange?: (value: string, isModified: boolean) => void;
    onBlur?: (value: string, isModified: boolean) => void;
    onEnter?: (value: string, isModified: boolean) => void;
    onEscape?: () => void;
}

const useModInput = ({ initialValue = '', onChange, onBlur, onEnter, onEscape }: UseModifiedInputParams) => {
    const [originValue, setOriginValue] = useState(initialValue);
    const [isModified, setIsModified] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
        value,
        setValue,
        handleChange: baseHandleChange,
    } = useInput<HTMLInputElement>({
        initialValue,
        onChange: (newValue) => {
            const newIsModified = newValue !== originValue;
            setIsModified(newIsModified);
            onChange?.(newValue, newIsModified);
        },
    });

    useEffect(() => {
        setOriginValue(initialValue);
        setValue(initialValue);
        setIsModified(false);
    }, [initialValue, setValue]);

    const handleFocus = useCallback(() => setIsFocused(true), []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        onBlur?.(value, isModified);
    }, [value, isModified, onBlur]);

    const resetToOrigin = useCallback(() => {
        setValue(originValue);
        setIsModified(false);
        onChange?.(originValue, false);
    }, [originValue, setValue]);

    const updateOriginValue = useCallback(
        (newOriginalValue: string) => {
            setOriginValue(newOriginalValue);
            setValue(newOriginalValue);
            setIsModified(false);
        },
        [setValue],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                onEnter?.(value, isModified);
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onEscape?.();
                inputRef.current?.blur();
            }
        },
        [value, isModified, onEnter, onEscape, resetToOrigin],
    );

    const callbackRef = useCallback(
        (node: HTMLInputElement | null) => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('focus', handleFocus);
                inputRef.current.removeEventListener('blur', handleBlur);
                inputRef.current.removeEventListener('keydown', handleKeyDown);
            }
            if (node) {
                node.addEventListener('focus', handleFocus);
                node.addEventListener('blur', handleBlur);
                node.addEventListener('keydown', handleKeyDown);
            }
            inputRef.current = node;
        },
        [handleFocus, handleBlur, handleKeyDown],
    );

    return {
        inputRef: callbackRef,
        value,
        isModified,
        isFocused,
        originalValue: originValue,
        setValue,
        handleChange: baseHandleChange,
        resetToOrigin,
        updateOriginValue,
    };
};
export default useModInput;
