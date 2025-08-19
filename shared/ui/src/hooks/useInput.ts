import { ChangeEvent, useCallback, useEffect, useState } from 'react';

interface InputProps {
    initialValue?: string;
    onChange?: (value: string) => void;
}

export const useInput = <T extends HTMLElement & { value: string }>({ initialValue = '', onChange }: InputProps) => {
    const [value, setValue] = useState(initialValue);

    const handleChange = useCallback(
        (event: ChangeEvent<T>) => {
            const newValue = event.target.value;
            setValue(newValue);

            if (onChange) {
                onChange(newValue);
            }
        },
        [onChange],
    );

    const updateValue = useCallback((newValue: string) => setValue(newValue), []);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    return {
        value,
        setValue: updateValue,
        handleChange,
    };
};
