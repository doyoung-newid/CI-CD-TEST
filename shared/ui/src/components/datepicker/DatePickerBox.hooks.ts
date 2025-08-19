import { useCallback, useEffect, useRef, useState } from 'react';

interface Props<T> {
    validate: (validation: T) => boolean;
    initialValidation: T;
}

export const useDatePickerBox = <T>({ validate, initialValidation }: Props<T>) => {
    const pickerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = useState(false);
    const [validation, setValidation] = useState<T>(initialValidation);

    const toggleOpen = () => setIsOpen((prev) => !prev);

    const close = () => {
        setIsOpen(false);
        setValidation(initialValidation);
    };

    const handleValidationChange = useCallback((validation: T) => setValidation(validation), []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const isInsideContainer = pickerRef.current?.contains(target);
            const isInsideTrigger = triggerRef.current?.contains(target);

            if (!isInsideContainer && !isInsideTrigger) {
                const initFocus = () => {
                    const picker = pickerRef.current;
                    if (!picker) return;

                    const inputs = picker.querySelectorAll('input');
                    const activeInput = Array.from(inputs).find((input) => document.activeElement === input);
                    activeInput?.blur();
                };

                requestAnimationFrame(initFocus);

                if (validation !== undefined && validate(validation)) {
                    close();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, validation, validate]);

    return {
        pickerRef,
        triggerRef,
        isOpen,
        toggleOpen,
        close,
        handleValidationChange,
    };
};
