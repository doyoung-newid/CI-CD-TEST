import { useCallback, useRef, useState } from 'react';
import { useInput } from '@/hooks/useInput.ts';

interface UseCellInputParams {
    initialValue?: string;
    onChange?: (value: string) => void;
    onDone?: (value: string) => void;
    onEnter?: () => void;
}

const useCellInput = ({ initialValue = '', onChange, onDone, onEnter }: UseCellInputParams) => {
    const [originValue, setOriginValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const { value, setValue, handleChange } = useInput<HTMLInputElement>({
        initialValue,
        onChange: (newValue) => onChange?.(newValue),
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const escKeyPressedRef = useRef(false);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
        escKeyPressedRef.current = false;
    }, []);

    const [isComposing, setIsComposing] = useState(false);

    const handleCompositionStart = useCallback(() => {
        setIsComposing(true);
    }, []);

    const handleCompositionEnd = useCallback(() => {
        setIsComposing(false);
    }, []);

    const handleBlur = useCallback(() => {
        setIsFocused(false);
        if (!escKeyPressedRef.current && originValue !== value) {
            setOriginValue(value);
            onDone?.(value);
        }
    }, [onDone, originValue, value]);

    const handleReset = useCallback(() => {
        setValue(originValue);
        onChange?.(originValue);
    }, [originValue, setValue, onChange]);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                if (isComposing) return;

                e.preventDefault();

                onEnter?.();
                inputRef.current?.blur();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                escKeyPressedRef.current = true;
                setValue(originValue);
                inputRef.current?.blur();
            }
        },
        [originValue, setValue, isComposing],
    );

    const callbackRef = useCallback(
        (node: HTMLInputElement | null) => {
            if (inputRef.current) {
                inputRef.current.removeEventListener('focus', handleFocus);
                inputRef.current.removeEventListener('blur', handleBlur);
                inputRef.current.removeEventListener('keydown', handleKeyDown);
                inputRef.current.removeEventListener('compositionstart', handleCompositionStart);
                inputRef.current.removeEventListener('compositionend', handleCompositionEnd);
            }
            if (node) {
                node.addEventListener('focus', handleFocus);
                node.addEventListener('blur', handleBlur);
                node.addEventListener('keydown', handleKeyDown);
                node.addEventListener('compositionstart', handleCompositionStart);
                node.addEventListener('compositionend', handleCompositionEnd);
            }
            inputRef.current = node;
        },
        [handleFocus, handleBlur, handleKeyDown, handleCompositionStart, handleCompositionEnd],
    );

    return {
        inputRef: callbackRef,
        isModified: originValue !== value,
        isFocused,
        originValue,
        value,
        setValue,
        handleChange,
        handleReset,
    };
};
export default useCellInput;
